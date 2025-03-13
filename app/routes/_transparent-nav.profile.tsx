import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { getAuthCookie, type AuthCookieProps } from "~/services/cookie";
import { fetchQueueReservedInfo } from "~/repositories/queue.repository";
import { fetchUserInfo } from "~/repositories/user.repository";
import type { User } from "~/types/user";
import QueueCard from "~/components/queue-card-profile";
import type { QueueReserveds } from "~/types/queue";


interface LoaderData {
    user: User
    queues: QueueReserveds
}

export async function loader({ request }: LoaderFunctionArgs) {
    var user
    try {
        const cookie: AuthCookieProps = await getAuthCookie({ request });
        user = {
            userId: cookie.user_id,
            token: cookie.token
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }

    if (!user) {
        throw new Error("User Not Found")
    }
    const userData: User = await fetchUserInfo(user.userId, request);
    const queuesData = await fetchQueueReservedInfo(request);

    return {
        user: userData,
        queues: queuesData
    }
}

export default function Profile() {
    const { user, queues } = useLoaderData() as LoaderData

    return (
        <div className="h-full">
            <div className="bg-[#242F40] h-60 flex flex-col justify-end relative">
                <img className="rounded-full z-10 inline-block size-40 absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 border-2 border-white object-cover" src="/teenoi.png" alt="feijf" width={40} height={40} />
            </div>
            <div className="flex flex-col items-center pt-24 gap-10">
                <div className="font-bold text-3xl">{user.data.name}</div>
                <div className="text-xl">{user.data.phone}</div>
                <div className="text-md">Edit Profile</div>
            </div>
            <div className="mt-10 ml-14 font-bold text-2xl">ประวัติการจอง</div>
            <div className="flex flex-col mt-8 items-center gap-5">
                {queues?.data.length > 0 ? (
                    queues?.data.map((queue, index) => {
                        return <QueueCard key={index} queue={queue} />
                    })
                ) : (
                    <div className="text-gray-500">No history available</div>
                )}
            </div>
        </div>
    );
}
