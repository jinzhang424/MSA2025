import axios from 'axios';

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
        await axios.post('/api/Message/SendMessages', messageDto, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const getChatroomMessages = async (token: string, chatroomId: number): Promise<Message[] | null> => {
    try {
        const res = await axios.get(`/api/Message/GetChatroomMessages/${chatroomId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return res.data as Message[];
    } catch (e) {
        console.error(e);
        return null;
    }
}