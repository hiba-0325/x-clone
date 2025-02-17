import axios, { isAxiosError } from "axios";
import Cookies from "js-cookie";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:3008",
    headers: {
     "Content-Type": "multipart/form-data"
        
    },
    withCredentials:true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const userCookie = Cookies.get("user");
        if(userCookie){
            const user = JSON.parse(userCookie);
            const token = user.token;
            if(token){
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config;
    },
    (error) => {
    return Promise.reject(error);
    }


)

export const axiosErrorCatch = (error: unknown): string => {
    if (isAxiosError(error)) {
      if (error.response) {
        return (
          error.response.data?.message ||
          `Error: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        return "No response received from the server. Please try again later.";
      } else {
        return `Error in request setup: ${error.message}`;
      }
    } else if (error instanceof Error) {
      return `${error.message}`;
    } else {
      return "An unknown error occurred. Please try again.";
    }
  };
  


export default axiosInstance;