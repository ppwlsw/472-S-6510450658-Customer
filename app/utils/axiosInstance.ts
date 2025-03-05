import axios, { type AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import type { AuthCookie } from "~/models/authCookie";
import { authCookie } from "~/services/cookie";

async function parseCookie(s: string) {
    return await authCookie.parse(s);
}

function useAxiosInstance(request: Request): AxiosInstance {
    const axiosInstance: AxiosInstance = axios.create({
        baseURL: process.env.API_BASE_URL,
        headers: {
            'Content-Type': process.env.CONTENT_TYPE || 'application/json',
            'X-Content-Type-Options': 'nosniff'
        },
        timeout: 10000,
        withCredentials: true
    });

    axiosInstance.interceptors.request.use(
        async (config) => {
            const cookie = request.headers.get("cookie");
            if (cookie) {
                try {
                    const data : AuthCookie = await parseCookie(cookie);
                    if (data?.token.plain_text) {
                        config.headers.Authorization = `Bearer ${data.token.plain_text}`;
                    }
                } catch (e) {
                    throw e
                }
            }

            return config;
        },

        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        async (response) => await response.data,

        (error) => {
            if (error.response) {
                console.error(`API Error: ${error.response.status}`);
            } else if (error.request) {
                console.error('Network error');
            }
            return Promise.reject(error);
        }
    );

    axiosRetry(axiosInstance, {
        retries: 3,
        shouldResetTimeout: true,
        retryDelay: axiosRetry.exponentialDelay,
        retryCondition: (error) => {
            return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 500;
        },
    });

    return axiosInstance;
}

export default useAxiosInstance