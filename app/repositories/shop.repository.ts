import type { Queue, Queues } from "~/types/queue";
import useAxiosInstance from "~/utils/axiosInstance";

export async function getShopsInfo(request: Request) {
    try{
        const axios = useAxiosInstance(request, {raw:true})
        const response = await axios.get<Shops>("/shops")

        return response.data.data
    }catch(e){
        console.log(e);
        return []
    }
}

export async function getShopInfoByID(request: Request, shop_id: string) {
    const axios = useAxiosInstance(request, { raw: true })
    const response = await axios.get<Queues>("/queues?shop_id=" + shop_id)

    return response.data.data
}

export async function sendBookQueueRequest(request: Request, queue: Queue) {
    try {
        const axios = useAxiosInstance(request);
        await axios.post(`/queues/${queue.id}/join`, { queue_user_got: `${queue.tag}${queue.queue_counter + 1}` });

        return true
    } catch (e) {
        return false
    }
}

