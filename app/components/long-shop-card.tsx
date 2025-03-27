import { useNavigate } from 'react-router';
import { Hourglass, Lock } from 'lucide-react';

interface LongShopCardProps {
  img_url: string;
  name: string;
  distance: string;
  total_queue: string;
  shop_id: number;
  is_open: boolean;
}

function LongShopCard({ 
  img_url, 
  name, 
  distance, 
  total_queue, 
  shop_id, 
  is_open 
}: LongShopCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (is_open) {
      navigate(`/shop/${shop_id}`);
    }
  };

  return (
    <div
      className={`
        w-full 
        flex 
        flex-col 
        gap-2.5 
        border-gray-200 
        border-[1px] 
        rounded-xl 
        transition-all 
        pb-4
        ${is_open 
          ? 'hover:shadow-xl cursor-pointer' 
          : 'opacity-50 cursor-not-allowed'}
      `}
      onClick={handleClick}
    >
      <div className="relative w-full">
        <img
          src={img_url}
          alt={name}
          className={`
            w-full 
            object-cover 
            h-48 
            rounded-t-xl 
            aspect-[16/9]
            ${!is_open ? 'brightness-50' : ''}
          `}
        />
        {!is_open && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Lock className="text-white" size={48} />
          </div>
        )}
      </div>
      <div className="w-full flex flex-row justify-between items-center px-2.5">
        <p className={`font-semibold text-lg ${!is_open ? 'text-gray-500' : ''}`}>
          {name}
        </p>
        <div className="flex flex-row items-center text-black gap-1">
          <Hourglass width={16} height={16} />
          <p className="text-sm">คิวตอนนี้: {total_queue}</p>
        </div>
      </div>
      <p className={`w-full text-sm px-2.5 ${!is_open ? 'text-gray-400' : 'text-[#878787]'}`}>
        ระยะห่าง: {distance} km
      </p>
      {!is_open && (
        <div className="w-full px-2.5 mt-1">
          <p className="text-sm text-red-500 font-medium">ปิดให้บริการ</p>
        </div>
      )}
    </div>
  );
}

export default LongShopCard;