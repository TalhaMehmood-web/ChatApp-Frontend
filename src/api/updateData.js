import toast from "react-hot-toast";
import axios from "../utils/AxiosConfig";

export const updateData = async (endpoint, fieldsToUpdate) => {
    try {
        const data = await axios.put(endpoint, fieldsToUpdate)
        console.log(fieldsToUpdate);
        return data;
    } catch (error) {

        throw error;
    }
}