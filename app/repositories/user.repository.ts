import type { User } from "~/types/user";
import useAxiosInstance from "~/utils/axiosInstance";

const API_BASE_URL: string = process.env.API_BASE_URL as string;

export async function fetchUserInfo(user_id: number, request: Request) {
  try {
    const axios = useAxiosInstance(request, { raw: true })
    const response = await axios.get<User>(`/users/${user_id}`)

    return response.data

  } catch (e) {
    throw new Error("Error fetch")
  }
}

export async function defaultFetcherUserInfo(user_id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/users/${user_id}`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    },
  )
  const json = await response.json();
  return json;
}