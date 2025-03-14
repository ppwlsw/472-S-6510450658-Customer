import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import CurrentLocationCard from "~/components/current-location-card";
import EmptyListIcon from "~/components/empty-list";
import EndListIcon from "~/components/end-of-list";
import GapController from "~/components/gap-control";
import LongShopCard from "~/components/long-shop-card";
import NearbyShopCard from "~/components/nearby-shop-card";
import ScrollToTopButton from "~/components/scroll-to-top-button";
import SearchBar from "~/components/search-bar";
import XAxisSlide from "~/components/x-axis-slide";
import { getShopsInfo } from "~/repositories/shop.repository";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const shops: Shop[] = await getShopsInfo(request);
    return shops;
  } catch (e) {
    return [];
  }
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

interface LocationData {
  success: boolean;
  lat?: string;
  lon?: string;
  name?: string;
  display_name?: string;
  address?: any;
  error?: string;
}

function HomePage() {
  const shops = useLoaderData<Shop[]>();
  const filteredShops = shops.filter(shop => shop.is_open);

  const [userLocation, setUserLocation] = useState<LocationData>({ success: false });
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [distances, setDistances] = useState<{[id: string]: string}>({});

//   useEffect(() => {
//     const getUserLocation = () => {
//       if ("geolocation" in navigator) {
//         navigator.geolocation.getCurrentPosition(
//           async (position) => {
//             try {
//               const response = await axios.get(
//                 `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
//               );
              
//               const locationData = {
//                 success: true,
//                 lat: String(position.coords.latitude),
//                 lon: String(position.coords.longitude),
//                 name: response.data.name,
//                 display_name: response.data.display_name,
//                 address: response.data.address
//               };
              
//               setUserLocation(locationData);
//               if (filteredShops.length > 0) {
//                 const newDistances: {[id: string]: string} = {};
//                 const shopsWithDistances = filteredShops.map(shop => {
//                   const distance = calculateDistance(
//                     position.coords.latitude,
//                     position.coords.longitude,
//                     shop.latitude,
//                     shop.longitude
//                   );
//                   newDistances[shop.id] = `${distance.toFixed(2)} km`;
//                   return { ...shop, distance };
//                 });

//                 shopsWithDistances.sort((a, b) => a.distance - b.distance);

//                 setDistances(newDistances);
//               }
//             } catch (error) {
//               setUserLocation({
//                 success: false,
//                 error: "ไม่สามารถดึงข้อมูลตำแหน่งได้"
//               });
//             } finally {
//               setIsLoadingLocation(false);
//             }
//           },
//           (error) => {
//             setUserLocation({
//               success: false,
//               error: "ไม่สามารถดึงข้อมูลตำแหน่งของผู้ใช้ได้"
//             });
//             setIsLoadingLocation(false);
//           }
//         );
//       } else {
//         setUserLocation({
//           success: false,
//           error: "browser ของคุณไม่รองรับการดึงข้อมูลตำแหน่ง กรุณาเปลี่ยน browser"
//         });
//         setIsLoadingLocation(false);
//       }
//     };
    
//     getUserLocation();
//   }, []);
    useEffect(()=>{
        async function a(){
            try {
                const latitude = 13.8479786
                const longitude = 100.5697013
                const response = await axios.get(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );
                
                const locationData = {
                  success: true,
                  lat: String(latitude),
                  lon: String(longitude),
                  name: response.data.name,
                  display_name: response.data.display_name,
                  address: response.data.address
                };
                
                setUserLocation(locationData);
                if (filteredShops.length > 0) {
                  const newDistances: {[id: string]: string} = {};
                  const shopsWithDistances = filteredShops.map(shop => {
                    const distance = calculateDistance(
                      latitude,
                      longitude,
                      shop.latitude,
                      shop.longitude
                    );
                    newDistances[shop.id] = `${distance.toFixed(2)} km`;
                    return { ...shop, distance };
                  });
  
                  shopsWithDistances.sort((a, b) => a.distance - b.distance);
  
                  setDistances(newDistances);
                }
              } catch (error) {
                setUserLocation({
                  success: false,
                  error: "ไม่สามารถดึงข้อมูลตำแหน่งได้"
                });
              } finally {
                setIsLoadingLocation(false);
              }
        }

        a();
    },[])

  return (
    <div className="overflow-x-hidden mt-[-1px]">
      <CurrentLocationCard 
        isLoading={isLoadingLocation}
        locationName={userLocation.success ? userLocation.display_name : userLocation.error}
        lat={userLocation.lat}
        lon={userLocation.lon}
      />
      <div className="px-5 pb-16">
        <div className="flex justify-center w-full mb-5">
          <SearchBar />
        </div>
        <GapController gap={55}>
          <div className="w-full">
            <GapController gap={15}>
              <h1 className="text-[20px] font-bold">ร้านค้าใกล้เคียงยอดนิยม</h1>
              {filteredShops.length === 0 ? (
                <EmptyListIcon />
              ) : (
                <div className="w-full overflow-x-visible">
                  <XAxisSlide>
                    {filteredShops
                        .map((shop) => ({
                        ...shop,
                        distance: parseFloat(distances[shop.id] || "0"),
                        }))
                        .sort((a, b) => a.distance - b.distance)
                        .map((shop) => (
                        <NearbyShopCard
                            key={shop.id}
                            id={shop.id}
                            img_url={shop.image_uri || "public/starbuck.png"}
                            name={shop.name}
                            distance={`${shop.distance.toFixed(2)} km`}
                        />
                        ))}
                    <EndListIcon />
                </XAxisSlide>
                </div>
              )}
            </GapController>
          </div>
          <div className="w-full">
            <GapController gap={15}>
              <h1 className="text-[20px] font-bold">ร้านค้าทั้งหมด</h1>
              {filteredShops.length === 0 ? (
                <EmptyListIcon />
              ) : (
                <>
                  {filteredShops.map((shop, index) => (
                    <LongShopCard
                      key={shop.id}
                      shop_id={shop.id}
                      img_url={shop.image_uri || "public/starbuck.png"}
                      name={shop.name}
                      distance={distances[shop.id] || ""}
                      total_queue={"30"}
                    />
                  ))}
                  <EndListIcon />
                </>
              )}
            </GapController>
          </div>
        </GapController>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default HomePage;