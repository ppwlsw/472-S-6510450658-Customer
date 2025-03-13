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
import useAxiosInstance from "~/utils/axiosInstance";

interface ShopProps{
    id: number;
    name: string
    email: string;
    is_verified: boolean;
    address: string;
    phone: string;
    description: string;
    image_uri?: string;
    is_open: boolean;
    latitude: number;
    longitude: number
}

export async function loader({request} : LoaderFunctionArgs){
    try{
      const axios = useAxiosInstance(request)
      const data : any = await axios.get("/shops")
      return data

    }catch(e){
        return [];
    }
}
function HomePage() {
    const shops = useLoaderData<ShopProps[]>();
    const filteredShops = shops.filter(shop => shop.is_open);
  
    return (
      <div className="overflow-x-hidden mt-[-1px]">
        <CurrentLocationCard />
        <div className="px-5">
          <div className="flex justify-center w-full mb-5">
            <SearchBar />
          </div>
  
          <GapController gap={55}>
            <div>
              <GapController gap={15}>
                <h1 className="text-[20px] font-bold">ร้านค้าใกล้เคียงยอดนิยม</h1>
                {filteredShops.length === 0 ? (
                  <EmptyListIcon />
                ) : (
                  <XAxisSlide>
                    {filteredShops.map((shop, index) => (
                      <NearbyShopCard
                        key={index}
                        img_url={shop.image_uri || "public/starbuck.png"}
                        name={shop.name}
                        distance={"100"}
                      ></NearbyShopCard>
                    ))}
                    <EndListIcon></EndListIcon>
                  </XAxisSlide>
                )}
              </GapController>
            </div>
            <div>
              <GapController gap={15}>
                <h1 className="text-[20px] font-bold">ร้านค้าทั้งหมด</h1>
                {filteredShops.length === 0 ? (
                  <EmptyListIcon />
                ) : (
                  <>
                    {filteredShops.map((shop, index) => (
                      <LongShopCard
                        key={index}
                        img_url={shop.image_uri || "public/starbuck.png"}
                        name={shop.name}
                        distance={"100"}
                        total_queue={"30"}
                      ></LongShopCard>
                    ))}
                    <EndListIcon></EndListIcon>
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
  

export default HomePage