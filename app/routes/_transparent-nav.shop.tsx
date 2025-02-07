import { useState } from 'react';
import { Hourglass, MapPin } from 'lucide-react';
import GapController from '~/components/gap-control';
import QueueCard from '~/components/queue-card';
import XAxisSlide from '~/components/x-axis-slide';

function ShopPage() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedQueue, setSelectedQueue] = useState<number | null>(null);

    const handleQueueClick = (index: number) => {
        setSelectedQueue(index);
    };

    return (
        <div className="relative pb-52">
            <img 
                src="public/starbuck.png" 
                alt="Shop" 
                className="h-[28.8vh] w-full object-cover filter brightness-50"
            />

            <div className="absolute top-[21vh] left-0 right-0 bg-white mx-3.5 px-4 py-2.5 rounded-xl shadow-lg">
                <div className="flex flex-row h-[11.8vh] items-center">
                    <img src="public/starbuck.png" className="w-[80px] h-[80px] rounded-md object-cover" />

                    <div className="ml-4 w-full">
                        <GapController gap={5}>
                            <h1 className="font-bold text-[20px] truncate w-[250px]">
                                ผู้พันธ์วิทยาศาสตร์ (เกษตร)
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
                                    ${selectedIndex === index ? "font-semibold text-black" : "text-gray-500"}`}
                            >
                                {tab}
                                <span
                                    className={`absolute left-0 bottom-0 w-full h-[2px] bg-black transition-all duration-300
                                        ${selectedIndex === index ? "scale-x-100" : "scale-x-0"}
                                    `}
                                />
                            </button>
                        ))}
                    </div>

                    <div
                        className={`transition-all duration-500 ease-in-out transform ${
                            selectedIndex === 0 ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    >
                        {selectedIndex === 0 && (
                            <GapController gap={20}>
                                <div className="py-2.5">
                                    <XAxisSlide>
                                        {["Queue 1", "Queue 2", "Queue 3", "Queue 4", "Queue 5", "Queue 6"].map((queue, index) => (
                                            <QueueCard
                                                key={index}
                                                isAvailable={index % 2 === 0}
                                                onClick={() => handleQueueClick(index)}
                                                isSelected={selectedQueue === index}
                                            />
                                        ))}
                                    </XAxisSlide>
                                </div>

                                <div className="py-2.5">
                                    <GapController gap={10}>
                                        <h1 className="font-bold text-[24px]">ข้อมูลรายการที่เลือก</h1>
                                        <p className="font-normal text-[16px] text-gray-400 w-full whitespace-normal">
                                            โต๊ะประเภท A 1-2 คน, 1 เตา
                                        </p>
                                    </GapController>
                                </div>
                            </GapController>
                        )}
                    </div>

                    <button
                        className="bg-primary-dark rounded-xl w-full text-white py-[15px]"
                        onClick={() => console.log(`Send to backend: User book ${selectedQueue}`)}
                    >
                        จองเลย
                    </button>

                    <div
                        className={`transition-all duration-500 ease-in-out transform ${
                            selectedIndex === 1 ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    >
                        {selectedIndex === 1 && (
                            <div className="mx-[20px] mt-[9vh]">
                                This is description part
                            </div>
                        )}
                    </div>
                </GapController>
            </div>
        </div>
    );
}

export default ShopPage;
