import axios from "../utils/AxiosConfig";
export const fetchData = async (endpoint) => {
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(`Failed to fetch data ${endpoint}`);
        console.log(error);
        // throw new Error(`Failed to fetch data ${endpoint}`);
    }
};