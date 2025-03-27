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
  const distanceNumber = parseFloat(distance.split(" ")[0]);
  const isLocked = !is_open || distanceNumber > 2;

  const lockMessage = !is_open 
    ? "ปิดให้บริการ" 
    : "คุณอยู่ไกลเกินไป";

  return (
    <Link
      to={!isLocked ? `/shop/${id}` : "#"} 
      className={`block w-full ${isLocked ? 'pointer-events-none' : ''}`}
    >
      <div 
        className={`
          flex 
          flex-col 
          w-full 
          ${isLocked ? 'opacity-50' : ''}
          h-[200px]  // Fixed height to maintain stability
          min-h-[200px]  // Ensure the card is not too short
        `}
      >
        <div className="relative w-full h-[126px]">
          <img 
            src={img_url} 
            alt={name}
            className={`
              h-full 
              w-full 
              object-cover 
              mb-4 
              ${isLocked ? 'brightness-50' : ''}
            `}
          />
          {isLocked && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Lock className="text-white" size={36} />
            </div>
          )}
        </div>
        <p 
          className={`mb-1 ${isLocked ? 'text-gray-500' : ''} text-ellipsis overflow-hidden`}
          style={{ whiteSpace: 'nowrap' }}
        >
          {name}
        </p>
        <div className="flex justify-between items-center">
          <p 
            className={`text-[#878787] ${isLocked ? 'text-gray-400' : ''} text-ellipsis overflow-hidden`} 
            style={{ whiteSpace: 'nowrap' }}
          >
            {distance}
          </p>
        </div>
        {isLocked && (
          <p className="text-sm text-red-500 font-medium mt-2">{lockMessage}</p>
        )}
      </div>
    </Link>
  );
}

export default NearbyShopCard;
