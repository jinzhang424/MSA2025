import axios from 'axios';

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

/**
 * Sends a message to the specified chatroom.
 *
 * @param token - The user's jwt for authentication.
 * @param messageDto - An object containing the message data.
 * @returns A promise that resolves with the response data from the server.
 */
export const sendMessage = async (token: string, messageDto: MessageDto) => {
    const res = await axios.post(`${API_BASE_URL}/api/Message/SendMessages`, messageDto, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
};

/**
 * Gets a chatroom's list of messages
 * 
 * @param token user's jwt
 * @param chatroomId The chatroom's id
 * @returns A list of messages or null
 */
export const getChatroomMessages = async (token: string, chatroomId: number): Promise<Message[]> => {
    const res = await axios.get(`${API_BASE_URL}/api/Message/GetChatroomMessages/${chatroomId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return res.data as Message[];
}