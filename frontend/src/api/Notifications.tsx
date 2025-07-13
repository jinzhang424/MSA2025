import axios from "axios"
import { toast } from "react-toastify"

export interface Notification {
    id: number,
    title: string,
    content: string,
    createdAt: string,
    isRead: boolean
}

export const getNotifications = async (token: string, limit:number): Promise<Notification[]> => {
    try {
        const res = await axios.get(`/api/Notification/GetNotifications/${limit}`, {
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

export const markAsRead = async (id: number, token: string) => {
    try {
        await axios.patch(`/api/Notification/MarkAsRead/${id}`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return true;
    } catch (e) {
        console.error("Error while marking notification as read");
        return false;
    }
}