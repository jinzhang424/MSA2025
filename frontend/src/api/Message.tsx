import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface MessageDto {
    chatroomId: number;
    content: string;
}

export interface Message {
    messageId: number;
    senderId: number;
    senderFirstName: string,
    senderLastName: string,
    content: string;
    chatroomId: number;
    createdAt: string;
}

export const sendMessage = async (token: string, messageDto: MessageDto): Promise<boolean> => {
    try {
        await axios.post(`${API_BASE_URL}/api/Message/SendMessages`, messageDto, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return true;
    } catch (e: any) {
        toast.error(e.reponse?.data);
        console.error(e);
        return false;
    }
};

export const getChatroomMessages = async (token: string, chatroomId: number): Promise<Message[] | null> => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/Message/GetChatroomMessages/${chatroomId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return res.data as Message[];
    } catch (e) {
        toast.error("Error occured while loading messages");
        console.error(e);
        return null;
    }
}