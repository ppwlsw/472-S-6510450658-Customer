interface QueueCardProps {
    queue: {
        shop_name: string;
        status: string;
        shop_image_url: string;
        // Other queue properties can be added here
    }
}

export default function QueueCardWaiting({ queue }: QueueCardProps) {
    // Get appropriate status color
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'waiting':
                return 'text-amber-500 bg-amber-50 border-amber-200';
            case 'completed':
                return 'text-green-500 bg-green-50 border-green-200';
            case 'cancelled':
                return 'text-red-500 bg-red-50 border-red-200';
            case 'in progress':
                return 'text-blue-500 bg-blue-50 border-blue-200';
            default:
                return 'text-gray-500 bg-gray-50 border-gray-200';
        }
    };

    const statusColorClass = getStatusColor(queue?.status);

    return (
        <div className="flex flex-row gap-4 border border-gray-200 bg-white rounded-lg py-4 w-full items-center px-6 justify-between transition-all hover:bg-gray-50 shadow-sm hover:shadow-md">
            <div className="flex items-center gap-5">
                <div className="rounded-full w-16 h-16 overflow-hidden flex-shrink-0 shadow border border-gray-100">
                    <img
                        className="w-full h-full object-cover"
                        src="/teenoi.png"
                        alt={queue?.shop_name || "Restaurant"}
                    />
                </div>
                <div className="flex flex-col">
                    <div className="font-semibold text-lg text-gray-800">
                        {queue?.shop_name || "Unknown shop"}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                        คิวของคุณกำลังดำเนินการ
                    </div>
                </div>
            </div>

            <div className={`px-3 py-1.5 rounded-full border ${statusColorClass} text-sm font-medium`}>
                {queue?.status || "Unknown"}
            </div>
        </div>
    );
}
