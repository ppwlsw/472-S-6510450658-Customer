import { useEffect, useRef, useState } from "react";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";

interface QueueStatus {
  position: number;
}

interface QueueInformation {
  data: {
    shop_name: string;
    queue_name: string;
    queue_number: string;
    shop_description: string;
    queue_tag: string;
  };
}

interface LoaderData {
  queueId: string;
  info: QueueInformation;
  status: QueueStatus;
  url: {
    urlQueueInformation: string;
    urlQueueStatus: string;
  };
}

export async function loader({ params }: LoaderFunctionArgs) {
  const queueId = params.queueId;
  if (!queueId) {
    return redirect("/shop");
  }

  const BACKEND_URL = process.env.BACKEND_URL;
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is not set in the environment variables.");
  }

  const urlQueueInformation: string = `${BACKEND_URL}/queues/${queueId}/getQueueNumber`;
  const urlQueueStatus: string = `${BACKEND_URL}/queues/${queueId}/status`;
  console.log(urlQueueStatus)
  console.log(urlQueueInformation)

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer 1|FhiYiHotoUVNQQb1vAaZeRS2XSlQqrNEg9cMra9T4bb0860a`, // Store the token in an env variable
  };

  try {

    const infoRes = await fetch(urlQueueInformation, { headers: headers, method: "GET" })
    if (!infoRes.ok) {
      throw new Error("Failed to fetch info data.");
    }
    const infoData = await infoRes.json();
    const bodyQueueStatus = JSON.stringify({ queue_user_got: infoData.data.queue_number })
    const statusRes = await fetch(urlQueueStatus, { headers: headers, method: "POST", body: bodyQueueStatus })
    if (!statusRes.ok) {
      throw new Error("Failed to fetch status data.");
    }
    const statusData = await statusRes.json();


    console.log(infoData)
    console.log(statusData)

    return json({
      queueId,
      info: infoData, // Ensure this key exists in the response
      status: statusData,
      url: {
        urlQueueInformation,
        urlQueueStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching queue data:", error);
    return json({ error: "Failed to load queue data." }, { status: 500 });
  }
}

export default function QueuePage() {
  const { queueId, info, status, url } = useLoaderData() as LoaderData;

  const [isCustomerTurn, setIsCustomerTurn] = useState(false);
  const [dynamicStatus, setStatus] = useState<QueueStatus>(status)
  const eventSourceRef = useRef<EventSource | null>(null);
  const queueUserGot = info.data.queue_number

  //SSE Connection
  useEffect(() => {
    if (!queueId) return;
    if (isCustomerTurn) return;

    // ปิด connection เดิมก่อนเปิดใหม่
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `http://localhost:3001/api/queues/${queueId}/subscribe`
    );
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const queue = "3_" + queueUserGot;

        if (data.nextQueue === queue) {
          setIsCustomerTurn(true);
          eventSource.close()
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer 1|FhiYiHotoUVNQQb1vAaZeRS2XSlQqrNEg9cMra9T4bb0860a`, // Store the token in an env variable
        };


        if (data.event === "next" || data.event === "cancel") {
          console.log(data)
          fetch(url.urlQueueStatus, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ queue_user_got: queueUserGot }),
          })
            .then((res) => res.json())
            .then((statusData) => setStatus(statusData))
            .catch((error) =>
              console.error("Error updating queue status:", error)
            );
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = () => {
      console.error("SSE connection failed");
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, [queueId, url.urlQueueStatus]);

  const getBackgroundColor = (position: number | undefined) => {
    if (isCustomerTurn) return "bg-green-500";
    if (position === undefined) return "bg-gray-400";
    if (position === 0) return "bg-green-500";
    if (position == 1) return "bg-red-500";
    if (position == 2) return "bg-yellow-500";
    if (position >= 3) return "bg-blue-500";
    return "bg-gray-100";
  };

  const getBorderColor = (position: number | undefined) => {
    if (isCustomerTurn) return "border-green-500";
    if (position === undefined) return "border-gray-400";
    if (position === 0) return "border-green-500";
    if (position == 1) return "border-red-500";
    if (position == 2) return "border-yellow-500";
    if (position >= 3) return "border-blue-500";
    return "border-gray-400";
  };

  return (
    <div className={`${getBackgroundColor(status?.position)}`}>
      <div className="flex flex-col h-full pt-16">
        <div className="mt-10 text-white ml-4 mb-36">
          <h1 className="text-2xl">{info?.data.shop_name}</h1>
          <p className="ml-2 text-l">
            โครงการ Box Space ห้องเลขที่ E3 ชั่้นที่ 1
          </p>
        </div>
        <div className="z-10 -mb-36 flex flex-row justify-center">
          <div
            className={`shadow-md w-64 h-64 bg-white rounded-full border-[9px] ${getBorderColor(
              status?.position
            )} flex justify-center items-center`}
          >
            <h1 className="text-5xl font-bold text-[#242F40]">
              {isCustomerTurn ? "NICE" : info?.data.queue_number}
            </h1>
          </div>
        </div>
        <div className="bg-white h-full rounded-t-[25px] flex justify-center">
          <div className="flex flex-col mt-48 items-center gap-10">
            <div className="text-[#242F40] text-3xl">Reservation for:</div>
            <div className="text-2xl">{info?.data.shop_description}</div>
            <div className="flex flex-row gap-20 text-xl">
              <div className="flex flex-col items-center">
                <h2>12</h2>
                <h3>Estimate Time</h3>
              </div>
              <div className="flex flex-col items-center">
                <h2>{dynamicStatus.position}</h2>
                <h3>Person ahead</h3>
              </div>
            </div>
            <div className="text-2xl mb-10">Cancel queue</div>
          </div>
        </div>
      </div>
    </div>
  );
}
