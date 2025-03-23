interface QueueCardProps {
    queue: {
        shop_name: string;
        created_at: string;
        // Other queue properties can be added here
    }
}

export default function QueueCard({ queue }: QueueCardProps) {
    // Format the date if needed
    const formattedDate = formatDate(queue?.created_at);

    return (
        <div className="flex flex-row gap-4 border border-gray-300 bg-white rounded-lg py-3 w-full items-center px-5 justify-between transition-all hover:bg-gray-50">
            <div className="flex items-center gap-4">
                <div className="rounded-full w-16 h-16 overflow-hidden flex-shrink-0 shadow-sm">
                    <img
                        className="w-full h-full object-cover"
                        src="/teenoi.png"
                        alt={queue?.shop_name || "Restaurant"}
                    />
                </div>

                <div className="flex flex-col">
                    <div className="font-medium text-lg text-gray-800">
                        {queue?.shop_name || "Unknown shop"}
                    </div>
                    <div className="text-gray-500 text-sm">
                        {formattedDate || "Unknown Date"}
                    </div>
                </div>
            </div>

            <div className="text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
}

// Helper function to format date strings
function formatDate(dateString?: string): string {
    if (!dateString) return "";

    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } catch (error) {
        return dateString;
    }
}
