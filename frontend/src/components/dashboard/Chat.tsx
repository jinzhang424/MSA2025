import { useState, useRef, useEffect } from 'react';
import { FiSend, FiSearch, FiUsers, FiMessageCircle } from 'react-icons/fi';
import { type User } from '../../types/dashboard';
import { FaChevronLeft } from "react-icons/fa6";
import { getChatroomListings, type ChatRoomListing } from '../../api/Chatroom';
import { getChatroomMessages, sendMessage, type Message, type MessageDto } from '../../api/Message';
import { createSignalRConnection } from '../../utils/signalr';
import { toast, ToastContainer } from 'react-toastify';
import SpinnerLoader from '../loaders/SpinnerLoader';
import { useTokenQuery } from '../../hooks/useTokenQuery';

interface ChatProps {
    user: User;
}

const Chat = ({ user }: ChatProps) => {
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [openChat, setOpenChat] = useState(false);

    const [chatRooms, setChatRooms] = useState<ChatRoomListing[]>([]);
    const [isLoadingChatList, setIsLoadingChatList] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [messages, setMessages] = useState<Message[]>([]);
    const connectionRef = useRef<any>(null);
    const currentChatroomRef = useRef<number | null>(null);

    // Initialize SignalR connection once
    useEffect(() => {
        const connection = createSignalRConnection(user.token);

        connection.on('ReceiveMessage', (message: Message) => {
            console.log('Received message:', message);
            // Only add message if it's for the currently selected chatroom
            if (message.chatroomId === currentChatroomRef.current) {
                setMessages(prev => [...prev, message]);
            }
        });

        connection
            .start()
            .then(() => {
                console.log('SignalR connected');
            })
            .catch((e: any) => {
                toast.error("Error connecting to chat");
                console.error("SignalR Connection error", e);
            });

        connectionRef.current = connection;

        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, [user.token]);

    // Handle chatroom selection and group management
    useEffect(() => {
        const connection = connectionRef.current;
        if (!connection || !selectedChat) return;

        // Leave previous chatroom if any
        if (currentChatroomRef.current && currentChatroomRef.current !== selectedChat) {
            connection.invoke('LeaveChatroom', currentChatroomRef.current.toString())
                .catch(console.error);
        }

        // Join new chatroom
        connection.invoke('JoinChatroom', selectedChat.toString())
            .then(() => {
                console.log(`Joined chatroom ${selectedChat}`);
                currentChatroomRef.current = selectedChat;
            })
            .catch(console.error);

        return () => {
            if (currentChatroomRef.current) {
                connection.invoke('LeaveChatroom', currentChatroomRef.current.toString())
                    .catch(console.error);
                currentChatroomRef.current = null;
            }
        };
    }, [selectedChat]);

    const fetchChatRooms = async () => {
        setIsLoadingChatList(true);
        const data = await getChatroomListings(user.token);
        setChatRooms(data);
        setIsLoadingChatList(false);
    };

    useTokenQuery(fetchChatRooms)

    const filteredChats = chatRooms.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedChatRoom = chatRooms.find(chatroom => chatroom.chatroomId === selectedChat);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        setIsSending(true);

        const messageContent = newMessage;
        const message: MessageDto = {
            chatroomId: selectedChat,
            content: messageContent,
        };

        const success = await sendMessage(user.token, message);
        if (success) {
            setNewMessage("");
        }
        
        setIsSending(false);
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        if (isToday) {
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
        }
    };

    const handleSelectChat = async (chatId: number) => {
        setIsLoadingMessages(true);

        const messages = await getChatroomMessages(user.token, chatId);
        if (messages != null) {
            setMessages(messages)
            setOpenChat(true)
            setSelectedChat(chatId)
        }

        setIsLoadingMessages(false);
    }

    return (
        <div className="h-screen relative flex bg-gray-100 shadow-sm border border-gray-200 overflow-hidden">
            <ToastContainer/>
            {/* Chat List Sidebar */}
            <div className="sm:static absolute md:w-80 w-full border-r border-gray-200 flex flex-col">
                {/* Search Header */}
                <div className="p-4 border-b border-gray-200 relative">
                    <FiSearch className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Chat List */}
                {isLoadingChatList ? 
                    (
                        <SpinnerLoader className='flex mt-8 justify-center w-full'>
                            Loading chat list...
                        </SpinnerLoader>
                    ) : (
                        <div className="flex-1 overflow-y-auto">
                            {filteredChats.map((chat) => (
                                <div
                                    key={chat.chatroomId}
                                    onClick={() => handleSelectChat(chat.chatroomId)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        selectedChat === chat.chatroomId ? 'bg-purple-50 border-r-2 border-r-purple-950' : ''
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        {/* Avatar or Group Icon */}
                                        <div className="relative">
                                            {chat.isGroup ? (
                                                <div className="w-12 h-12 bg-purple-950 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {chat.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <FiUsers className="text-white" size={20} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Chat Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {chat.name}
                                                </h3>
                                            </div>
                                            {chat.lastMessage && (
                                                <p className="text-sm text-gray-600 truncate">
                                                    {chat.lastMessage.senderId === user.id ? 'You' : `${chat.lastMessage.senderFirstName}`}{`: ${chat.lastMessage.content}`}
                                                </p>
                                            )}
                                            <div className='flex sm:flex-row flex-col'>
                                                {chat.lastMessage && (
                                                    <span className="text-xs text-gray-500">
                                                        {formatTime(chat.lastMessage.createdAt)}
                                                    </span>
                                                )}
                                                {/* {chat.isGroup && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-sm">
                                                        Project Chat
                                                    </span>
                                                )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>

            {isLoadingMessages ? (
                <SpinnerLoader className='flex mt-12=6 justify-center w-full'>
                    Loading chat...
                </SpinnerLoader>
            ) : (
                <>
                    {/* Chat Area */}
                    {selectedChatRoom ? (
                        <div className={`md:static absolute flex-1 flex flex-col bg-gray-50 w-full h-full ${!openChat && 'translate-x-full'} duration-300`}>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 bg-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <button 
                                            className='sm:px-2 px-2 opacity-70 hover:opacity-100 cursor-pointer' 
                                            onClick={() => setOpenChat(false)}
                                        >
                                            <FaChevronLeft />
                                        </button>

                                        {/* Avatar */}
                                        <div className="relative">
                                            {selectedChatRoom?.isGroup ? (
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <FiUsers className="text-white" size={18} />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 bg-purple-950 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {selectedChatRoom?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Chat Info */}
                                        <div>
                                            <h2 className="font-semibold text-gray-900">{selectedChatRoom?.name}</h2>
                                            <p className="text-sm text-gray-600">
                                                {selectedChatRoom?.isGroup && `${selectedChatRoom?.participants.length} members`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 h-full p-4 space-y-4 overflow-y-scroll">
                                {messages.map((message, index) => {
                                    const isOwn = message.senderId === user.id;
                                    const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== message.senderId);
                                    
                                    return (
                                        <div key={message.messageId} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                                {/* Avatar */}
                                                {showAvatar && !isOwn && (
                                                    <div className="w-8 h-8 bg-purple-950 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white font-semibold text-xs">
                                                            {`${message.senderFirstName[0].toUpperCase()}${message.senderLastName[0].toUpperCase()}`}
                                                        </span>
                                                    </div>
                                                )}
                                                {!showAvatar && !isOwn && <div className="w-8" />}

                                                {/* Message Bubble */}
                                                <div className={`rounded-md px-4 py-2 ${
                                                    isOwn 
                                                        ? 'bg-purple-950 text-white' 
                                                        : 'bg-gray-200 text-gray-900'
                                                }`}>
                                                    {showAvatar && !isOwn && (
                                                        <p className="text-xs font-medium mb-1 text-gray-600">
                                                            {`${message.senderFirstName} ${message.senderLastName}`}
                                                        </p>
                                                    )}
                                                    <p className="text-sm">{message.content}</p>
                                                    <p className={`text-xs mt-1 ${
                                                        isOwn ? 'text-purple-200' : 'text-gray-500'
                                                    }`}>
                                                        {formatTime(message.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t border-gray-200 bg-white">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || isSending}
                                        className="p-2 bg-purple-950 text-white rounded-full hover:bg-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FiSend size={21} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        /* No Chat Selected */
                        <div className="flex-1 items-center justify-center bg-gray-50 md:flex hidden">
                            <div className="text-center">
                                <FiMessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Chat;
