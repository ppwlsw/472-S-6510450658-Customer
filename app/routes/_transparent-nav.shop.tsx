"use client";

import { useEffect, useState } from "react";
import { Hourglass, MapPin, Phone } from "lucide-react";
import GapController from "~/components/gap-control";
import QueueCard from "~/components/queue-card";
import XAxisSlide from "~/components/x-axis-slide";
import MenuCard from "~/components/menu-card";
import { useNavigate } from "react-router";

interface Queue {
  id: number;
  name: string;
  description: string;
  queue_image_url: string;
  queue_counter: number;
  is_available: boolean;
  tag: string;
}

interface Queues {
  data: Queue[];
}

function ShopPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedQueue, setSelectedQueue] = useState<number | null>(null);
  const [queue, setQueue] = useState<Queue | null>(null);
  const [queues, setQueues] = useState<Queues>({ data: [] });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleQueueClick = (index: number, queue: Queue) => {
    setSelectedQueue(index);
    setQueue(queue);
  };

  const handleBookQueue = async () => {
    setLoading(true);
    if (queue) {
      const queueUserGot = `${queue.tag}${queue.queue_counter + 1}`;
      console.log("user got:" + queueUserGot)
      console.log(queue.id)
      const urlForBookQueue = `http://localhost/api/queues/${queue.id}/join`;
      const fetchData = async () => {
        try {
          const response = await fetch(urlForBookQueue, {
            method: "POST",
            headers: header,
            body: JSON.stringify({
              queue_user_got: queueUserGot,
            }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error("Failed to fetch queues");
          navigate(`/queue/${queue?.id}`);
        } catch (error) {
          console.error(error);
          console.log(error)
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  };


  const urlForQueues = "http://localhost/api/queues?shop_id=3";
  const header = {
    "Content-Type": "application/json",
    Authorization: "Bearer 1|FhiYiHotoUVNQQb1vAaZeRS2XSlQqrNEg9cMra9T4bb0860a",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlForQueues, {
          method: "GET",
          headers: header,
        });
        if (!response.ok) throw new Error("Failed to fetch queues");
        console.log(response)
        const data: Queues = await response.json();
        setQueues(data);
      } catch (error) {
        console.error("Error fetching queues:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative pb-52">
      <img
        src="/starbuck.png"
        alt="Shop"
        className="h-[28.8vh] w-full object-cover filter brightness-50"
      />

      {/* card show information of shop show queue and location */}
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

      {/* tab book and  information */}
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
                    {queues.data.map((queue, index) => (
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
                {/* ข้อมูลรายการที่เลือก */}
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
            <button
              className="bg-primary-dark rounded-xl w-full text-white py-[15px]"
              onClick={handleBookQueue}
              disabled={loading}
            >
              จองเลย
            </button>
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
