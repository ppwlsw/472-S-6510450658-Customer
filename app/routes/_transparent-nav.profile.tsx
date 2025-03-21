import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { getAuthCookie, type AuthCookieProps } from "~/utils/cookie";
import { fetchQueueReservedInfo } from "~/repositories/queue.repository";
import { fetchUserInfo } from "~/repositories/user.repository";
import type { User } from "~/types/user";
import QueueCard from "~/components/queue-card-profile";

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
    const { user, queues } = useLoaderData<typeof loader>()

    return (
        <div className="h-screen bg-primary-white-smoke">
            <div className="bg-[#242F40] h-60 flex flex-col justify-end relative">
                <img
                    className="rounded-full z-10 inline-block size-40 absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 border-4 border-white object-cover shadow-lg"
                    src={user.data.image_url}
                    alt={user.data.name}
                    width={80}
                    height={80}
                />
            </div>

            <div className="flex flex-col items-center pt-32 gap-6 px-4">
                <div className="font-bold text-4xl text-[#242F40]">{user.data.name}</div>
                <div className="text-xl text-gray-700">{user.data.phone}</div>
                <Link to="/profile-edit">
                    <div className="text-md text-[#1E40AF] hover:text-[#3B82F6] transition-all">
                        Edit Profile
                    </div>
                </Link>
            </div>

            <div className="mt-14 px-6">
                <div className="font-bold text-3xl text-[#242F40]">ประวัติการจอง</div>
                <div className="flex flex-col mt-8 gap-6">
                    {queues?.data.length > 0 ? (
                        queues?.data.map((queue, index) => (
                            <QueueCard key={index} queue={queue} />
                        ))
                    ) : (
                        <div className="text-gray-500 text-lg">No history available</div>
                    )}
                </div>
            </div>
        </div>
    );
}
