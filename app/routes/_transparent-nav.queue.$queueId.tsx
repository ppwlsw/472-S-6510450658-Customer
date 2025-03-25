import { useEffect, useRef, useState } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router";
import {
  fetchQueueInformation,
  fetchQueueStatus,
} from "~/repositories/queue.repository";
import type { QueueInformation, QueueStatus } from "~/types/queue";
import { useAuth } from "~/utils/auth";

interface LoaderData {
  queueId: string;
  user: {
    userId: string;
    token: string;
  };
  info: QueueInformation;
  status: QueueStatus;
  url: {
    urlQueueInformation: string;
    urlQueueStatus: string;
    urlForCancelQueue: string;
    urlSubscribe: string;
  };
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  var user;
  const { getCookie } = useAuth;
  const cookie = await getCookie({ request });

  user = {
    userId: cookie.user_id,
    token: cookie.token,
  };

  const queueId = params.queueId;
  if (!queueId) {
    return redirect("/homepage");
  }

  const urlQueueInformation: string = `${process.env.NETWORK_URL}/api/queues/${queueId}/getQueueNumber`;
  const urlQueueStatus: string = `${process.env.NETWORK_URL}/api/queues/${queueId}/status`;
  const urlForCancelQueue: string = `${process.env.NETWORK_URL}/api/queues/${queueId}/cancel`;
  const urlSubscribe: string = `${process.env.NETWORK_URL}:3001/api/queues/${queueId}/subscribe`;

  try {
    const infoRes: QueueInformation = await fetchQueueInformation(
      queueId,
      request
    );

    if (infoRes.data == null) {
      return redirect("/homepage");
    }
    const statusRes = await fetchQueueStatus(
      queueId,
      infoRes.data.queue_number,
      request
    );

    return {
      queueId: queueId,
      user: user,
      info: infoRes, // Ensure this key exists in the response
      status: statusRes,
      url: {
        urlQueueInformation,
        urlQueueStatus,
        urlForCancelQueue,
        urlSubscribe,
      },
    };
  } catch (e) {
    return { error: "Error ", e };
  }
}
export default function QueuePage() {
  const { queueId, user, info, status, url } = useLoaderData() as LoaderData;

  const [isCustomerTurn, setIsCustomerTurn] = useState(false);
  const [dynamicStatus, setStatus] = useState<QueueStatus>(status);
  const eventSourceRef = useRef<EventSource | null>(null);
  const queueUserGot = info.data.queue_number;
  const navigate = useNavigate();

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + user.token, // Store the token in an env variable
  };

  const handleCancelQueue = async () => {
    const urlForCancelQueue = url.urlForCancelQueue;
    const fetchData = async () => {
      try {
        const response = await fetch(urlForCancelQueue, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            queue_user_got: queueUserGot,
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch queues");
        const data = await response.json();
        if (data.removeStatus == true) {
          navigate("/homepage");
        }
      } catch (error) {
        console.error(error);
        console.log(error);
      }
    };
    fetchData();
  };

  //SSE Connection
  useEffect(() => {
    if (!queueId) return;
    if (isCustomerTurn) return;

    // ปิด connection เดิมก่อนเปิดใหม่
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(url.urlSubscribe);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const queue = user.userId + "_" + queueUserGot;

        if (data.nextQueue === queue) {
          setIsCustomerTurn(true);
          eventSource.close();
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token, // Store the token in an env variable
        };

        if (data.event === "next" || data.event === "cancel") {
          fetch(url.urlQueueStatus, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ queue_user_got: queueUserGot }),
          })
            .then((res) => res.json())
            .then((statusData) => {
              setStatus(statusData);
            })
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
    <div className={`${getBackgroundColor(dynamicStatus?.position)}`}>
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
              dynamicStatus?.position
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
            <div className="text-2xl line-clamp-2 text-center px-4">
              {info?.data.shop_description}
            </div>

            {isCustomerTurn ? (
              <div></div>
            ) : (
              <div className="flex flex-row gap-20 text-xl">
                <div className="flex flex-col items-center">
                  <h2>{dynamicStatus.position}</h2>
                  <h3>Person ahead</h3>
                </div>
              </div>
            )}

            {isCustomerTurn ? (
              <div className="text-green-500">
                ✔
              </div>
            ) : (
              <button
                className={`${getBackgroundColor(
                  dynamicStatus?.position
                )} rounded-3xl text-white py-[15px] w-10/12`}
                onClick={handleCancelQueue}
              >
                Cancel Queue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
