import QueueCard from "./queueCard";
import { useEffect, useState } from "react";

interface User {
    data: {
        name: string;
        user_image_url: string;
        user_phone: string;

    };
}

interface Queue {
    shop_name: string;
    created_at: string;
    shop_image_url: string;
}

interface Queues {
    data: Queue[];
}


export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [queues, setQueues] = useState<Queues | null>(null);
    const urlForUser = "http://localhost:80/api/users/18"
    const urlForQueuesReserved = "http://localhost:80/api/queues/getAllQueuesReserved"
    const header = {
        "Content-Type": "application/json",
        Authorization: "Bearer 10|XrjLTbF41OzFz485cxqlzCrz2hmJZKVnHa1xCUt167bf4c1e",
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(urlForUser, {
                    method: "GET",
                    headers: header,
                });
                if (!response.ok) throw new Error("Failed to fetch queues");
                const data: User = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching queues:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(urlForQueuesReserved, {
                    method: "GET",
                    headers: header,
                });
                if (!response.ok) throw new Error("Failed to fetch queues");
                const data: Queues = await response.json();
                setQueues(data);
            } catch (error) {
                console.error("Error fetching queues:", error);
            }
        };

        fetchData();
    }, []);


    return (
        <div className="h-full">
            <div className="bg-[#242F40] h-60 flex flex-col justify-end relative">
                <img className="rounded-full z-10 inline-block size-40 absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 border-2 border-white object-cover" src="/teenoi.png" alt="feijf" width={40} height={40} />
            </div>
            <div className="flex flex-col items-center pt-24 gap-10">
                <div className="font-bold text-3xl">{user?.data.name}</div>
                <div className="text-xl">{user?.data.user_phone}</div>
                <div className="text-md">Edit Profile</div>
            </div>
            <div className="mt-10 ml-14 font-bold text-2xl">ประวัติการจอง</div>
            <div className="flex flex-col mt-8 items-center gap-5">
                {queues?.data.length > 0 ? (
                    queues?.data.map((queue, index) => (
                        <QueueCard key={index} shopName={queue.shop_name} shopID={`${index}`} reserveWhen={queue.created_at} />
                    ))
                ) : (
                    <div className="text-gray-500">No history available</div>
                )}
            </div>
        </div>
    );
}
