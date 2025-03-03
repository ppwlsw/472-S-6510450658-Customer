import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean;
}

function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [hasFlash, setHasFlash] = useState(false);
  const [scanner, setScanner] = useState<QrScanner | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    
    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        window.location.href = result.data;
      },
      { returnDetailedScanResult: true }
    );
    
    setScanner(qrScanner);
    qrScanner.start().catch(console.error);
    
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        setCameraStream(stream);
        videoRef.current!.srcObject = stream;
        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
        setHasFlash(Boolean(capabilities.torch));
      })
      .catch(console.error);
    
    return () => {
      qrScanner.stop();
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

    try {
      const result = await QrScanner.scanImage(file);
      if (result) {
        window.location.href = result;
      }
    } catch (error) {
      alert("No QR code found in the image.");
      console.error(error);
    }
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-black">
      <video ref={videoRef} className="absolute w-full h-full object-cover" />
      <div className="absolute w-64 h-64">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />
      </div>
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      {/* Flash toggle button (left bottom) */}
      {hasFlash && (
        <button
          onClick={toggleFlashlight}
          className="absolute bottom-4 left-4 p-3 bg-white rounded-full text-black shadow-lg"
        >
          {isFlashOn ? "Flash Off" : "Flash On"}
        </button>
      )}
      
      {/* Image upload button (right bottom) */}
      <button
        onClick={handleFileSelect}
        className="absolute bottom-4 right-4 p-3 bg-white rounded-full text-black shadow-lg"
      >
        Select Image
      </button>
    </div>
  );
}

export default ScanPage;