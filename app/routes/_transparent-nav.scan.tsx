import { useEffect, useRef, useState } from "react";
import { Flashlight, FlashlightOff, FileImage, Loader2, AlertTriangle } from 'lucide-react';
import QrScanner from "qr-scanner";
import { redirect, useFetcher, type ActionFunctionArgs } from "react-router";
import { sendBookQueueRequest } from "~/repositories/shop.repository";
import type { Queue } from "~/types/queue";
import { fetchQueueInfoByID } from "~/repositories/queue.repository";

interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean;
}

interface ScannedData {
  action: string;
  queue_id?: string;
  shop_id?: string;
}

interface ActionMessage {
  message?: string;
  error?: string;
  status: number;
}

export async function action({request}:ActionFunctionArgs) {
  const formData = await request.formData();
  const queue_id = formData.get("queue_id") as string;
  if(!queue_id) return { status: false, error: "No queue ID provided" };

  try{
    const queue:Queue = await fetchQueueInfoByID(request, queue_id)
    const success = await sendBookQueueRequest(request, queue)

    if(success){
      return {
        status: true,
        message: `จอง ${queue.name} สำเร็จ`
      }
    }

    return {
      status: false,
      error: `ไม่สามารถจอง ${queue.name} ได้`
    }
  }catch(e){
    return{
      status: false,
      error: `ไม่พบคิวดังกล่าว`
    }
  }
}

function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const fetcher = useFetcher<ActionMessage>();

  const [isFlashOn, setIsFlashOn] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [hasFlash, setHasFlash] = useState(false);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const processQRCode = (parsedData: ScannedData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      switch(parsedData.action) {
        case 'q':
          if (!parsedData.queue_id) {
            throw new Error('No queue ID provided');
          }

          fetcher.submit(
            { 
              action: 'q', 
              queue_id: parsedData.queue_id 
            },
            { method: 'POST' }
          );
          break;
        
        case 's':
          if (parsedData.shop_id) {
            return window.location.pathname = `shop/${parsedData.shop_id}`
          } else {
            throw new Error('No shop ID provided');
          }
        
        default:
          throw new Error('Invalid QR code action');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      console.error('QR Code Processing Error:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fetcher.data) {
      setIsLoading(false);
      if (fetcher.data.status) {
        setSuccessMessage(fetcher.data.message || 'Operation successful');
        const redirectTimer = setTimeout(() => {
          window.location.pathname = '/homepage';
        }, 500);

        return () => clearTimeout(redirectTimer);
      } else {
        setErrorMessage(fetcher.data.error || 'An error occurred');
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (!videoRef.current) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        try {
          qrScanner.stop();
          
          const parsedData: ScannedData = JSON.parse(result.data);
          processQRCode(parsedData);
        } catch(e) {
          setErrorMessage('Invalid QR code format');
          console.error('Error parsing QR code:', e);
          setIsLoading(false);
        }
      },
      { 
        returnDetailedScanResult: true,
        maxScansPerSecond: 1
      }
    );
    
    setScanner(qrScanner);

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        
        setCameraStream(stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
        setHasFlash(Boolean(capabilities.torch));
        
        await qrScanner.start();
      } catch (error) {
        console.error('Camera start error:', error);
      }
    };

    startCamera();

    return () => {

      if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
      }

      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const toggleFlashlight = () => {
    if (!cameraStream) return;
    
    const videoTrack = cameraStream.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
    
    if (capabilities.torch) {
      videoTrack.applyConstraints({
        advanced: [{ torch: !isFlashOn } as ExtendedMediaTrackConstraintSet],
      });
      setIsFlashOn(!isFlashOn);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await QrScanner.scanImage(file, { 
        returnDetailedScanResult: true 
      });
      
      if (result) {
        const parsedData: ScannedData = JSON.parse(result.data);
        processQRCode(parsedData);
      }
    } catch (error) {
      setErrorMessage('No QR code found in the image');
      console.error(error);
      setIsLoading(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-black">
      <video 
        ref={videoRef} 
        className="absolute w-full h-full object-cover" 
        autoPlay 
        playsInline 
        muted 
      />

      <div className="absolute w-64 h-64">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />
      </div>

      {(errorMessage || successMessage) && (
        <div className={`
          absolute bottom-40 left-1/2 transform -translate-x-1/2 
          px-4 py-2 rounded-lg shadow-lg text-white 
          ${errorMessage ? 'bg-red-600' : 'bg-green-600'}
          flex items-center space-x-2
        `}>
          {errorMessage && <AlertTriangle className="w-5 h-5" />}
          <span>{errorMessage || successMessage}</span>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {hasFlash && (
        <button
          onClick={toggleFlashlight}
          className="absolute bottom-4 left-4 p-3 bg-white rounded-full text-black shadow-lg"
          disabled={isLoading}
          aria-label={isFlashOn ? "Turn off flashlight" : "Turn on flashlight"}
        >
          {isFlashOn ? <FlashlightOff /> : <Flashlight />}
        </button>
      )}

      <button
        onClick={handleFileSelect}
        className="absolute bottom-4 right-4 p-3 bg-white rounded-full text-black shadow-lg"
        disabled={isLoading}
        aria-label="Select image for QR code scanning"
      >
        <FileImage />
      </button>
    </div>
  );
}

export default ScanPage;