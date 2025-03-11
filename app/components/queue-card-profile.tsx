interface QueueCardProps {
    queue: {
        shop_name: string;
        created_at: string;
    }
}

export default function QueueCard({ queue }: QueueCardProps) {
    console.log(queue)
    return (
        <div className="flex flex-row gap-4 border border-gray-300 rounded-lg py-2 w-80 items-center px-4 justify-center">
            <img className="rounded-full w-16 h-16" src="/teenoi.png" alt="fef" />
            <div className="flex flex-col">
                <div>{queue?.shop_name || "Unknow shop"}</div>
                <div className="text-gray-500">{queue?.created_at || "Unknow Date"}</div>
            </div>
        </div>
    );
}
