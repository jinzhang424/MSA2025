import axios from "axios";

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

/**
 * Gets a user's chat list
 * @param token user's jwt
 * @returns A ChatRoomListing[] with the following properties: 
 * ```
 * {
 * chatroomId: number,
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
 * ```
 */
export const getChatrooms = async (token: string): Promise<ChatRoomListing[]> => {
    const res = await axios.get(`${API_BASE_URL}/api/Chatroom/GetChatrooms`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return res.data as ChatRoomListing[];
};