import { Rat } from 'lucide-react';

function EmptyListIcon() {
    return (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg">
            <Rat className="text-gray-400 mb-4" width={100} height={100}/>
            <p className="text-center text-lg font-medium text-gray-400">
                ขออภัยเราไม่มีพบข้อมูลในลิสต์นี้
            </p>
        </div>
    );
}

export default EmptyListIcon;