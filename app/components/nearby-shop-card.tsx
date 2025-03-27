import { Lock } from "lucide-react";
import { Link } from "react-router";

interface NearbyShopCardProps {
  id: number;
  img_url: string;
  name: string;
  distance: string;
  is_open: boolean;
}

function NearbyShopCard({ 
  id, 
  img_url, 
  name, 
  distance, 
  is_open 
}: NearbyShopCardProps) {
  return (
    <Link
      to={is_open ? `/shop/${id}` : "#"} 
      className={`block w-full ${!is_open ? 'pointer-events-none' : ''}`}
    >
      <div 
        className={`
          flex 
          flex-col 
          w-full 
          ${!is_open ? 'opacity-50' : ''}
        `}
      >
        <div className="relative w-full">
          <img 
            src={img_url} 
            alt={name}
            className={`
              h-[126px] 
              w-full 
              object-cover 
              mb-4 
              ${!is_open ? 'brightness-50' : ''}
            `}
          />
          {!is_open && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Lock className="text-white" size={36} />
            </div>
          )}
        </div>
        <p className={`mb-1 ${!is_open ? 'text-gray-500' : ''}`}>{name}</p>
        <div className="flex justify-between items-center">
          <p className={`text-[#878787] ${!is_open ? 'text-gray-400' : ''}`}>
            {distance} m
          </p>
        </div>
        {!is_open && (
            <p className="text-sm text-red-500 font-medium">ปิดให้บริการ</p>
          )}
      </div>
    </Link>
  );
}

export default NearbyShopCard;