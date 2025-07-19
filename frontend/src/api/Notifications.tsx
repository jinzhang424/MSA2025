import axios from "axios"
import { toast } from "react-toastify"

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface Notification {
    id: number,
    title: string,
    content: string,
    createdAt: string,
    isRead: boolean
}

/**
 * Gets the recent notifications of a user
 * 
 * @param token user's jwt
 * @param limit the maximum number of notifications returned
 * @returns notifications
 */
export const getNotifications = async (token: string, limit:number): Promise<Notification[]> => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/Notification/GetNotifications/${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log(res)
        return res.data as Notification[]
    } catch (e: any) {
        console.error("Error while getting unread notifications");
        toast.error(e.response?.message || "Error occurred while getting recent events")
        return[]
    }
}