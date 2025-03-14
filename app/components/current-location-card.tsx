import { Link } from "react-router";

interface CurrentLocationCardProps {
    isLoading?: boolean;
    locationName?: string;
    lat?: string;
    lon?: string;
  }
  
  function CurrentLocationCard({ isLoading = false, locationName, lat, lon }: CurrentLocationCardProps) {
    return (
      <Link to={`https://www.google.com/maps?q=${lat},${lon}`} target="_blank">
        <div className="rounded-b-[20px] h-[9.9vh] bg-primary-dark shadow-md px-6 mb-5 mt-0">
            <div className="flex gap-3.5">
            <div className="rounded-md bg-white w-[47px] h-[47px] overflow-hidden">
            <img
                height={47}
                width={47}
                src="/public/Notif.png"
                alt="Notification Icon"
                className="object-cover"
            />
            </div>
            <div className="flex flex-col text-white">
                <p>Current location</p>
                {isLoading ? (
                <p className="truncate w-[65vw]">กำลังค้นหาตำแหน่งของคุณ...</p>
                ) : (
                <p className="truncate w-[65vw]">
                    {locationName || "ไม่สามารถระบุตำแหน่งได้"}
                </p>
                )}
            </div>
            </div>
        </div>
      </Link>
    );
  }
  
  export default CurrentLocationCard;