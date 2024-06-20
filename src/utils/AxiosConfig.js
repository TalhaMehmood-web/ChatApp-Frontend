
import axios from "axios";
// Determine the environment
const BASE_URL = import.meta.env.MODE === 'production' ? import.meta.env.VITE_PRODUCTION_API_URL : import.meta.env.VITE_DEV_API_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 100000,
});

export default axiosInstance;
