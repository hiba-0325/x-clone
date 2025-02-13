import axios from "axios";
import Cookies from "js-cookie";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:3008",
    headers: {
        "Content-Type": "application/json",
        
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


export default axiosInstance;