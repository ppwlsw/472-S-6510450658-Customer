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

export async function defaultFetcherUserInfo(request:Request, user_id: number, token: string) {
  const axios = useAxiosInstance(request, {custom_token: token})
  const user:any = axios.get(`/users/${user_id}`)

  return user
}



export async function updateUserInfo(request:Request, user_id:number, {name, phone}:{name:string; phone:string}) {
    try{
        console.log(user_id)
        const axios = useAxiosInstance(request);
        const response = await axios.put(`/users/${user_id}`, { name, phone });;

        return response
    }catch(e){
        console.log(e)
        throw new Error("Error fetch")
    }
}