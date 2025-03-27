"use client";

import { useState } from "react";
import { Hourglass, Loader2, MapPin, Phone, TriangleAlert } from "lucide-react";
import GapController from "~/components/gap-control";
import QueueCard from "~/components/queue-card";
import XAxisSlide from "~/components/x-axis-slide";
import MenuCard from "~/components/menu-card";
import {
  redirect,
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import {
  getShopQueueInfoByID,
  getShopRecommendItems,
  getShopsInfoByID,
  sendBookQueueRequest,
} from "~/repositories/shop.repository";
import type { Queue } from "~/types/queue";
import { calculateDistance } from "~/utils/location";

interface ActionMessage {
  success: boolean;
  message: string;
}

interface Item {
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  is_available: boolean;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const shopID = params.shopID;

  if (!shopID) throw redirect("/");

  try {
    const data: Queue[] = await getShopQueueInfoByID(request, shopID);
    const shopInfo: Shop = await getShopsInfoByID(request, shopID);

    const items = await getShopRecommendItems(request, shopID);

    return { data, shopInfo, items };
  } catch (e) {
    return { data: [], shopInfo: null };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const queue: Queue = JSON.parse(formData.get("queue") as string);

  const success = await sendBookQueueRequest(request, queue);
  return success
    ? redirect(`/queue/${queue?.id}`)
    : redirect(`/queue/${queue?.id}`)
}

function ShopPage() {
  const fetcher = useFetcher<ActionMessage>();
  const loaderData = useLoaderData<{
    data: Queue[];
    shopInfo: Shop | null;
    items: Item[];
  }>();
  const queues = loaderData.data || [];
  const shop = loaderData.shopInfo;
  const latitude = 13.8479786;
  const longitude = 100.5697013;

  if (!shop) return redirect("/homepage");

  const IS_OPEN = shop.is_open
  const TOO_FAR = calculateDistance(latitude, longitude, shop.latitude, shop.longitude) > 2 // more that 2 km

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedQueue, setSelectedQueue] = useState<number | null>(null);
  const [queue, setQueue] = useState<Queue | null>(null);

  const handleQueueClick = (index: number, queue: Queue) => {
    setSelectedQueue(index);
    setQueue(queue);
  };

  return (
    <div className="relative pb-52 overflow-x-hidden mt-[-1.5px]">
      <img
        src={shop.image_url}
        alt="Shop Image"
        className="h-[28.8vh] w-full object-cover filter brightness-50"
      />

      <div className="absolute top-[21vh] left-0 right-0 bg-white mx-3.5 px-4 py-2.5 rounded-xl shadow-lg">
        <div className="flex flex-row h-[11.8vh] items-center">
          <img
            src={shop.image_url}
            className="w-[80px] h-[80px] rounded-md object-cover"
          />

          <div className="ml-4 w-full">
            <GapController gap={5}>
              <h1 className="font-bold text-[20px] truncate w-[250px]">
                {shop.name}
              </h1>
              <div className="flex flex-row items-center text-black">
                <Hourglass width={16} height={16} />
                <p className="ml-2 text-[14px]">คิวตอนนี้: 35</p>
              </div>
              <div className="flex flex-row items-center text-black/60">
                <MapPin width={16} height={16} />
                <p className="ml-2 text-[13px] font-normal truncate w-[250px]">
                  {shop.address}
                </p>
              </div>
            </GapController>
          </div>
        </div>
      </div>

      <div className="mx-[20px] mt-[9vh]">
        <GapController gap={20}>
          <div className="flex gap-2.5">
            {["จอง", "รายละเอียด"].map((tab, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative pb-2 text-[16px] transition-all duration-300 
                                    ${selectedIndex === index
                    ? "font-semibold text-black"
                    : "text-gray-500"
                  }`}
              >
                {tab}
                <span
                  className={`absolute left-0 bottom-0 w-full h-[2px] bg-black transition-all duration-300
                                        ${selectedIndex === index
                      ? "scale-x-100"
                      : "scale-x-0"
                    }
                                    `}
                />
              </button>
            ))}
          </div>

          <div
            className={`transition-all duration-500 ease-in-out transform ${selectedIndex === 0 ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            {selectedIndex === 0 && (
              <GapController gap={20}>
                <div className="w-[97svw] py-2.5 overflow-x-scroll">
                  <XAxisSlide>
                    {queues.map((queue, index) => (
                      <QueueCard
                        key={queue.id}
                        isAvailable={queue.is_available && IS_OPEN && !TOO_FAR}
                        onClick={() => handleQueueClick(index, queue)}
                        isSelected={selectedQueue === index}
                        name={queue.name}
                      />
                    ))}
                  </XAxisSlide>
                </div>

                <div className="py-2.5">
                  <GapController gap={10}>
                    <h1 className="font-bold text-[24px]">
                      ข้อมูลรายการที่เลือก
                    </h1>
                    <p className="font-normal text-[16px] text-gray-400 w-full whitespace-normal">
                      {queue?.description}
                    </p>
                  </GapController>
                </div>
              </GapController>
            )}
          </div>

          {IS_OPEN && !TOO_FAR ? (
            selectedIndex === 0 && queue ? (
              <fetcher.Form method="post" className="w-full">
                <input type="hidden" name="queue" value={JSON.stringify(queue)} />
                {fetcher?.state === "submitting" ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                  </div>
                ) : (
                  <button
                    className="bg-primary-dark rounded-xl w-full text-white py-[15px]"
                    id="bookQueue"
                    name="bookQueue"
                    type="submit"
                  >
                    จองเลย
                  </button>
                )}
              </fetcher.Form>
            ) : null
          ) : (
            selectedIndex === 0 ? (
              <div className={`flex flex-row items-center justify-center bg-red-600 text-white text-center py-4 rounded-xl font-bold text-lg w-full py-[15px]`}>
                <TriangleAlert className="mr-2"></TriangleAlert>
                {IS_OPEN ? "คุณอยู่ไกลเกินไป ไม่สามารถจองคิวได้" : "ร้านปิด ไม่สามารถจองคิวได้"}
              </div>
            ) : (<></>)
          )}

          <div
            className={`transition-all duration-500 ease-in-out transform ${selectedIndex === 1 ? "translate-x-0" : "translate-x-full"
              }`}
          >
            {selectedIndex === 1 && (
              <GapController gap={10}>
                <div className="py-6 border-black/33 border-b-[1px]">
                  <GapController gap={15}>
                    <h1 className="text-[32px] font-bold">รายละเอียด</h1>
                    <p className="text-[12px] font-normal">
                      {shop.description}
                    </p>
                    <GapController gap={5} y_axis={false}>
                      <MapPin width={14} height={17}></MapPin>
                      <p
                        className="underline text-[12px] font-bold"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`,
                            "_blank"
                          )
                        }
                      >
                        ดูตำแหน่งในแผนที่
                      </p>
                    </GapController>

                    <GapController gap={5} y_axis={false}>
                      <Phone width={14} height={17}></Phone>
                      <a
                        className="underline text-[12px] font-bold"
                        href={`tel:${shop.phone}`}
                      >
                        {shop.phone}
                      </a>
                    </GapController>
                  </GapController>
                </div>

                <div className="py-6">
                  <GapController gap={15}>
                    <h1 className="text-[32px] font-normal">รายการสินค้า</h1>
                    <div className="grid grid-cols-4 gap-x-auto gap-y-4">
                      {loaderData.items.length > 0 ? (
                        <>
                          {loaderData.items.map((item, index) => (
                            <MenuCard
                              key={index}
                              img_url={item.image_url}
                              name={item.name}
                            />
                          ))}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </GapController>
                </div>
              </GapController>
            )}
          </div>
        </GapController>
      </div>
    </div>
  );
}

export default ShopPage;
