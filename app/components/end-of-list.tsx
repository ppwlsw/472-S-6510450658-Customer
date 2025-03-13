import { Bird } from 'lucide-react';

function EndListIcon() {
    return (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg w-full">
            <Bird className="text-gray-400 mb-4" width={40} height={40}/>
            <p className="text-center text-lg font-medium text-gray-400">
                คุณเลื่อนมาจนสุดลิสแล้วครับ!😆
            </p>
        </div>
    );
}

export default EndListIcon;