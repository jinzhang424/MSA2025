import axios from "axios";

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
        const res = await axios.get('/api/Chatroom/GetChatroomListings', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data as ChatRoomListing[];
    } catch (e) {
        console.error(e);
        return [];
    }
};