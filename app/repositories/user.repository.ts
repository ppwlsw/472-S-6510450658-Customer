import type { User } from "~/types/user";
import useAxiosInstance from "~/utils/axiosInstance";
import fs from "fs";
import axios from "axios";
import { useAuth } from "~/utils/auth";

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

export async function updateUserAvatar(request: Request, user_id: number, file: File) {
    try {
      const { getCookie } = useAuth;
      const cookie = await getCookie({ request });
      const token = cookie?.token;
      if (!token) throw Error("Unauthorized");

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${process.env.API_BASE_URL}/users/${user_id}/avatar`, 
        {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Failed to upload image");
      }
      
      const responseData = await response.json();
      return responseData.data;
    } catch (e) {
      console.error("Upload error:", e);
      throw e;
    }
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
