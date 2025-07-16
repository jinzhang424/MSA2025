import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface Participants {
    userId: number
    image: string,
    firstName: string,
    lastName: string,
}

export interface ChatRoomListing {
    chatroomId: number,
    name: string,
    isGroup: boolean,
    participants: Participants[]
    lastMessage: {
        senderId: number,
        senderFirstName: string,
        content: string,
        createdAt: string,
    }
}

export const getChatroomListings = async (token: string): Promise<ChatRoomListing[]> => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/Chatroom/GetChatroomListings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data as ChatRoomListing[];
    } catch (e: any) {
        toast.error(e.response?.data || "Error getting chat listings")
        console.error(e);
        return [];
    }
};