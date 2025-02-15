import { Route } from "@remix-run/react";
import { Link } from "react-router-dom";

export interface MarkerData {
  title: string;
  address: string;
  currentQueue: number;
  imgUrl?: string;
}

export default function MarkerPopup({
  markerData,
}: {
  markerData: MarkerData;
}) {
  return (
    <Link to={"../"}>
      <div className="absolute bottom-20 bg-white rounded-md border border-slate-200 m-1 h-auto min-h-[150px] z-20 p-2 flex items-center w-11/12 sm:w-1/2">
        <div className="flex flex-row w-full h-full items-center ">
          <div className="w-1/3 h-full rounded-full bg-slate-200">
            <img
              src={
                markerData.imgUrl ||
                "https://images.deliveryhero.io/image/fd-th/th-logos/cl8sb-logo.jpg"
              }
              alt={markerData.title}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col justify-around w-full h-full ml-3">
            <div className="flex flex-row justify-start w-full text-lg font-bold">
              {markerData.title}
            </div>
            <div className="flex flex-row justify-start w-full line-clamp-2">
              ที่อยู่ : {markerData.address}
            </div>
            <div className="flex flex-row justify-start w-full font-bold">
              คิวตอนนี้ : {markerData.currentQueue}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
