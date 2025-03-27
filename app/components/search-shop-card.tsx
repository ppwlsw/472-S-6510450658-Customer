import React from 'react';
import { Hourglass, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';

interface ShopCardProps {
  shop_id: number;
  img_url: string; 
  name: string;
  distance: string;
  total_queue?: number;
  description?: string;
  is_open?: boolean;
}

const SearchShopCard = ({
  shop_id, 
  img_url, 
  name, 
  distance, 
  total_queue,
  description,
  is_open = true,
}: ShopCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (is_open) {
      navigate(`/shop/${shop_id}`);
    }
  };

  return (
    <div 
      onClick={handleClick} 
      className={`flex flex-col p-4 border rounded-lg hover:shadow-lg transition-all cursor-pointer w-full md:w-[95%] mx-auto ${!is_open ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex flex-row space-x-4 w-full">
        <div className="w-1/3 min-w-[120px] max-w-[150px]">
          <img
            src={img_url}
            alt={name}
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/default-image.jpg';
            }}
          />
        </div>
        <div className="flex flex-col justify-between flex-grow w-2/3">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold flex-grow pr-2 text-base md:text-xl">{name}</h3>
            </div>
            {description && <p className="text-gray-600 text-sm mt-1 line-clamp-3 w-full">{description}</p>}
            <div className="flex flex-wrap items-center text-gray-600 space-x-2 mt-2">
              <div className="flex items-center">
                <MapPin size={16} className="text-gray-500 mr-1" />
                <span className="text-sm">{distance} km</span>
              </div>
              {total_queue !== undefined && total_queue >= 0 && (
                <div className="flex items-center">
                    <Hourglass size={16} className="text-gray-500 mr-1" />
                    <span className="text-sm">Queue: {total_queue}</span>
                </div>
              )}
            </div>
            {!is_open && (
              <div className="text-red-500 text-sm mt-2">ปิดให้บริการ</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchShopCard;
