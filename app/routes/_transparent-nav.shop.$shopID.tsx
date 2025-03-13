"use client";

import {useState } from "react";
import { Hourglass, Loader2, MapPin, Phone } from "lucide-react";
import GapController from "~/components/gap-control";
import QueueCard from "~/components/queue-card";
import XAxisSlide from "~/components/x-axis-slide";
import MenuCard from "~/components/menu-card";
import { redirect, useFetcher, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { getShopInfoByID, sendBookQueueRequest } from "~/repositories/shop.repository";
import type { Queue } from "~/types/queue";

interface ActionMessage{
  success: boolean;
  message: string;
}

export async function loader({request, params}:LoaderFunctionArgs) {
  const shopID = params.shopID;

  if(!shopID)throw redirect("/");

  try{
    const data:Queue[] = await getShopInfoByID(request, shopID);
  
    return data
  }catch(e){
    return []
  }
}

export async function action({request}:ActionFunctionArgs) {
  const formData = await request.formData();
  const queue:Queue = JSON.parse(formData.get("queue") as string);

  const success = await sendBookQueueRequest(request, queue);
  return (success)? redirect(`/queue/${queue?.id}`) : {
    success,
    message: "จองคิวไม่สำเร็จ กรุณาลองอีกครั้ง"
  }
}

function ShopPage() {
  const fetcher = useFetcher<ActionMessage>();
  const loaderData = useLoaderData<Queue[]>();
  const queues = loaderData || [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedQueue, setSelectedQueue] = useState<number | null>(null);
  const [queue, setQueue] = useState<Queue | null>(null);


  const handleQueueClick = (index: number, queue: Queue) => {
    setSelectedQueue(index);
    setQueue(queue);
  };

  return (
    <div className="relative pb-52">
      <img
        src="/starbuck.png"
        alt="Shop"
        className="h-[28.8vh] w-full object-cover filter brightness-50"
      />

      <div className="absolute top-[21vh] left-0 right-0 bg-white mx-3.5 px-4 py-2.5 rounded-xl shadow-lg">
        <div className="flex flex-row h-[11.8vh] items-center">
          <img
            src="/starbuck.png"
            className="w-[80px] h-[80px] rounded-md object-cover"
          />

          <div className="ml-4 w-full">
            <GapController gap={5}>
              <h1 className="font-bold text-[20px] truncate w-[250px]">
              </h1>
              <div className="flex flex-row items-center text-black">
                <Hourglass width={16} height={16} />
                <p className="ml-2 text-[14px]">คิวตอนนี้: 35</p>
              </div>
              <div className="flex flex-row items-center text-black/60">
                <MapPin width={16} height={16} />
                <p className="ml-2 text-[13px] font-normal truncate w-[250px]">
                  โครงการ Box Space ห้องเลขที่ E3 ชั้นที่ 1 เลขที่ 1
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
                <div className="py-2.5">
                  <XAxisSlide>
                    {queues.map((queue, index) => (
                      <QueueCard
                        key={queue.id}
                        isAvailable={queue.is_available}
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

          {selectedIndex === 0 && queue && (
            <fetcher.Form method="post" className="w-full">
              <input type="hidden" name="queue" value={JSON.stringify(queue)} />
              {fetcher.state === "submitting" ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                </div>
              ):
              <button
                className="bg-primary-dark rounded-xl w-full text-white py-[15px]"
                id="bookQueue"
                name="bookQueue"
                type="submit"
              >
                จองเลย
              </button>}
            </fetcher.Form>
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
                      ศาสตราจารย์ ดร.สมบูรณ์ ปิ้งย่าง เกิดเมื่อปี พ.ศ. 2508
                      ในจังหวัดเชียงใหม่
                      เติบโตมาในครอบครัวที่รักการทำอาหารและมีร้านหมูกระทะเล็ก ๆ
                      เป็นของตนเอง
                      ความสนใจในศาสตร์แห่งการปิ้งย่างและการหมักเนื้อทำให้เขามุ่งมั่นศึกษาด้านวิทยาศาสตร์อาหารตั้งแต่เยาว์วัย
                    </p>
                    <GapController gap={5} y_axis={false}>
                      <MapPin width={14} height={17}></MapPin>
                      <p
                        className="underline text-[12px] font-bold"
                        onClick={() =>
                          window.open(
                            "https://maps.app.goo.gl/1zWR2sKegkbLM4yN8",
                            "_blank"
                          )
                        }
                      >
                        ดูตำแหน่งในแผนที่
                      </p>
                    </GapController>

                    <GapController gap={5} y_axis={false}>
                      <Phone width={14} height={17}></Phone>
                      <p className="underline text-[12px] font-bold">
                        091-234-5678
                      </p>
                    </GapController>
                  </GapController>
                </div>

                <div className="py-6">
                  <GapController gap={15}>
                    <h1 className="text-[32px] font-normal">รายการสินค้า</h1>
                    <div className="grid grid-cols-4 gap-x-auto gap-y-4">
                      <MenuCard
                        img_url="/starbuck.png"
                        name="Coffee"
                      ></MenuCard>
                      <MenuCard
                        img_url="/starbuck.png"
                        name="Coffee"
                      ></MenuCard>
                      <MenuCard
                        img_url="/starbuck.png"
                        name="Coffee"
                      ></MenuCard>
                      <MenuCard
                        img_url="/starbuck.png"
                        name="Coffee"
                      ></MenuCard>
                      <MenuCard
                        img_url="/starbuck.png"
                        name="Coffee"
                      ></MenuCard>
                      <MenuCard
                        img_url="/starbuck.png"
                        name="Coffee"
                      ></MenuCard>
                      <MenuCard
                        img_url="/starbuck.png"
                        name="Coffee"
                      ></MenuCard>
                      <MenuCard
                        img_url="/starbuck.png"
                        name="Coffee"
                      ></MenuCard>
                      <MenuCard
                        img_url="/starbuck.png"
                        name="Coffee"
                      ></MenuCard>
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
