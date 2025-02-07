import { Armchair } from 'lucide-react';

interface QueueCardProps {
    isAvailable: boolean;
    onClick: () => void;
    isSelected: boolean;
}

function QueueCard({ isAvailable, onClick, isSelected }: QueueCardProps) {
    return (
        <div
            onClick={isAvailable?onClick:function(){}}
            className={`flex flex-col gap-2.5 p-1.5 items-center w-[90px] rounded-lg 
                ${isAvailable ? 'text-primary-dark' : 'text-gray-400'}
                ${isSelected ? 'border-2 border-green-700' : ''}
                cursor-pointer`}
        >
            <Armchair />
            <p className="text-[13px] font-bold text-center w-full whitespace-normal">
                Table A (1-2) Persons
            </p>
        </div>
    );
}

export default QueueCard;
