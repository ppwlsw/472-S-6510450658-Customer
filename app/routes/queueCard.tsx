interface QueueCardProps {
    shopName: string;
    reserveWhen: string;
    shopID: string;
}

export default function QueueCard({ shopName, reserveWhen }: QueueCardProps) {
    return (
        <div className="flex flex-row gap-4 border border-gray-300 rounded-lg py-2 w-80 items-center px-4 justify-center">
            <img className="rounded-full w-16 h-16" src="/teenoi.png" alt="fef" />
            <div className="flex flex-col">
                <div>{shopName}</div>
                <div className="text-gray-500">{reserveWhen}</div>
            </div>
        </div>
    );
}
