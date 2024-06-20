import axiosInstance from "@/utils/AxiosConfig";
export const deleteData = async (endpoint) => {
    try {
        const response = await axiosInstance.delete(endpoint)
        return response.data;
    } catch (error) {
        throw error
    }
}