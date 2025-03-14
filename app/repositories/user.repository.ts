import type { User } from "~/types/user";
import useAxiosInstance from "~/utils/axiosInstance";

export async function fetchUserInfo(user_id: number, request: Request) {
  try {
    const axios = useAxiosInstance(request, { raw: true })
    const response = await axios.get<User>(`/users/${user_id}`)

    return response.data

  } catch (e) {
    throw new Error("Error fetch")
  }
}