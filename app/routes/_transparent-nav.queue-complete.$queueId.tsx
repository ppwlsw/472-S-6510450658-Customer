import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { fetchQueueCompleteInformation } from "~/repositories/queue.repository";
import type { QueueInformation } from "~/types/queue";
import { useAuth } from "~/utils/auth";

interface LoaderData {
  queueId: string;
  user: {
    userId: string
    token: string
  }
  info: QueueInformation;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  var user
  try {
    const { getCookie } = useAuth;
    const cookie = await getCookie({ request });

    user = {
      userId: cookie.user_id,
      token: cookie.token
    }
  } catch (error) {
    throw new Error("Cookie not found")
  }

  if (!user) {
    throw new Error("User id not found")
  }

  const queueId = params.queueId;
  if (!queueId) {
    return redirect("/homepage");
  }

  try {
    const infoRes: QueueInformation = await fetchQueueCompleteInformation(queueId, request)

    if (infoRes.data == null) {
      return redirect("/homepage")
    }

    return {
      info: infoRes, // Ensure this key exists in the response
    };
  } catch (e) {
    return { error: "Error ", e }
  }
}
export default function QueuePage() {
  const { info } = useLoaderData() as LoaderData;

  return (
    <div className={`bg-green-500`}>
      <div className="flex flex-col h-full pt-16">
        <div className="mt-10 text-white ml-4 mb-36">
          <h1 className="text-2xl">{info?.data.shop_name}</h1>
          <p className="ml-2 text-l">
            โครงการ Box Space ห้องเลขที่ E3 ชั่้นที่ 1
          </p>
        </div>
        <div className="z-10 -mb-36 flex flex-row justify-center">
          <div
            className={`shadow-md w-64 h-64 bg-white rounded-full border-[9px] border-green-500 
            flex justify-center items-center`}
          >
            <h1 className="text-5xl font-bold text-[#242F40]">
              ✔
            </h1>
          </div>
        </div>
        <div className="bg-white h-full rounded-t-[25px] flex justify-center">
          <div className="flex flex-col mt-48 items-center gap-10">
            <div className="text-[#242F40] text-3xl">Reservation for:</div>
            <div className="text-2xl line-clamp-2 text-center px-4">{info?.data.shop_description}</div>
            <div className="text-green-500">Completed</div>
          </div>
        </div>
      </div>
    </div >
  );
}
