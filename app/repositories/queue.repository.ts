import type { QueueInformation, QueueReserveds, QueueStatus } from "~/types/queue"
import useAxiosInstance from "~/utils/axiosInstance"


/*
 * use in profile page
 * for fetch queue that user already reserved
 * */

export async function fetchQueueReservedInfo(request: Request) {
  try {
    const axios = useAxiosInstance(request, { raw: true })
    const response = await axios.get<QueueReserveds>(`queues/getAllQueuesReserved`)

    return response.data
  } catch (e) {
    throw new Error("Error fetch")
  }
}

/*
 * use in queue page
 * for fetch queue infomation */
export async function fetchQueueInformation(queue_id: string, request: Request) {
  try {
    const axios = useAxiosInstance(request, { raw: true })
    const response = await axios.get<QueueInformation>(`/queues/${queue_id}/getQueueNumber`)

    return response.data
  } catch (e) {
    console.error(e)
    throw new Error("Error fetch")
  }
}

/*
 * use in queue page
 * for fetch how many queue use need to wait*/
export async function fetchQueueStatus(queue_id: string, queue_number: string, request: Request) {
  try {
    const axios = useAxiosInstance(request)
    const bodyQueueStatus = {
      queue_user_got: queue_number,
    }
    const response = await axios.post<QueueStatus>(`/queues/${queue_id}/status`, bodyQueueStatus)
    console.log(response)

    return response
  } catch (e) {
    console.error(e)
    throw new Error("Error fetch")
  }
}
