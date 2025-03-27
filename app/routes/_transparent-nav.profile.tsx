import { Link, redirect, useFetcher, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { fetchQueueReservedInfo } from "~/repositories/queue.repository";
import { fetchUserInfo } from "~/repositories/user.repository";
import QueueCard from "~/components/queue-card-profile";
import { useAuth } from "~/utils/auth";
import type { UserResponse } from "~/types/user";
import { prefetchImage } from "~/utils/image-proxy";
import { DataCenter } from "~/provider/datacenter";

// Types
interface ActionMessage {
  success: boolean;
  message: string;
}
interface EmptyStateProps {
  message: string;
}

// Loader function
export async function loader({ request }: LoaderFunctionArgs) {
  const { getCookie } = useAuth;
  const cookie = await getCookie({ request });

  if (!cookie?.user_id || !cookie?.token) {
    throw new Error("User Not Found");
  }

  const user = {
    userId: cookie.user_id,
    token: cookie.token,
  };

  // Fetch user data and reservation history in parallel
  const [userData, queuesData] = await Promise.all([
    fetchUserInfo(user.userId, request),
    fetchQueueReservedInfo(request)
  ]);

  DataCenter.addData("user_image_info", userData.data.image_url)
  userData.data.image_url = await prefetchImage(userData.data.image_url);


  for (const queue of queuesData.data) {
    queue.shop_image_url = await prefetchImage(queue.shop_image_url || "");
  }

  return {
    user: userData,
    queues: queuesData,
  };
}

// Action function
export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const queueId = formData.get("queueId") as string;

  try {
    console.log(`Queue action performed on queue ${queueId}`);
    return redirect(`/queue-complete/${queueId}`);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}

// Profile component
export default function Profile() {
  const { user, queues } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<ActionMessage>();

  const handleQueueClick = (queueId: number) => {
    const formData = new FormData();
    formData.append("queueId", `${queueId}`);
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <div className="min-h-screen bg-primary-white-smoke pb-10">
      {/* Profile header with image */}
      <ProfileHeader
        image_url={user.data.image_url}
        name={user.data.name}
        phone={user.data.phone}
        email={user.data.email}
      />

      {/* Reservation history section */}
      <section className="mt-14 px-6 max-w-3xl mx-auto">
        <h2 className="font-bold text-3xl text-[#242F40] mb-8">ประวัติการจอง</h2>

        <fetcher.Form method="post" className="w-full">
          {queues?.data?.length > 0 ? (
            <div className="space-y-4">
              {queues.data.map((queue, index) => (
                <div
                  key={index}
                  onClick={() => handleQueueClick(queue.queue_id)}
                  className="cursor-pointer hover:shadow-md transition-all rounded-lg"
                >
                  <QueueCard queue={queue} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No reservation history available" />
          )}
        </fetcher.Form>
      </section>
    </div>
  );
}

// Component for profile header section
function ProfileHeader({ image_url, name, phone, email }: UserResponse) {
  return (
    <div>
      <div className="bg-[#242F40] h-60 flex flex-col justify-end relative">
        <img
          className="rounded-full z-10 inline-block size-40 absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 border-4 border-white object-cover shadow-lg"
          src={image_url}
          alt={name}
          width={80}
          height={80}
        />
      </div>

      <div className="flex flex-col items-center pt-32 gap-6 px-4">
        <h1 className="font-bold text-4xl text-[#242F40]">{name}</h1>
        <p className="text-xl text-gray-700">{phone}</p>
        <Link to="/profile-edit">
          <div className="text-md text-[#1E40AF] hover:text-[#3B82F6] transition-all">
            Edit Profile
          </div>
        </Link>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}
