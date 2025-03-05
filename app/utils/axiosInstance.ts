import axios, { type AxiosInstance } from "axios";
import axiosRetry from "axios-retry";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.API_BASE_URL,
    headers: {
      'Content-Type': process.env.CONTENT_TYPE || 'application/json',
      'X-Content-Type-Options': 'nosniff'
    },
    timeout: 10000,
});  

axiosInstance.interceptors.request.use(
    (config)=>{
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config},

    (error)=>{
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response)=> response.data,

    (error)=>{
        if (error.response) {
            console.error(`API Error: ${error.response.status}`);
          } else if (error.request) {
            console.error('Network error');
          }
          return Promise.reject(error);
    }
)

axiosRetry(axiosInstance, {
    retries: 3,
    shouldResetTimeout: true,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 500;
    },
})

export default axiosInstance