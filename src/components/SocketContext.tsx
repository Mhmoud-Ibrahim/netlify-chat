import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import api from "./api";
import toast from 'react-hot-toast';
// --- Interfaces ---
export interface OnlineUser {
    userId: string;
    name: string;
    userImage?: string;
    fulluserImage?: string;
}

export interface MsgData {
    text: string;
    sender: string;
    imageUrl?: string;
    senderId: string;
    _id?: string;
    receiverId: string;
    timestamps: string;
    createdAt?: string | Date;
    seen: boolean;
}

export interface UserData {
    id: string; // تأكد من استخدامه كـ _id كما في MongoDB
    name: string;
    email: string;
    userImage?: string;
    fulluserImage?: string;
    createdAt?: string;
}

export interface SocketContextValue {
    socket: Socket | null;
    isConnected: boolean;
    messages: MsgData[];
    notification: { msg: string, senderName: string, senderId: string } | null;
    sendMsg: (msg: MsgData) => void;
    deleteMsg: (msg: MsgData) => void;
    deleteSenderMessages: () => void;
    userId: string;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
    selectedUser: string | null;
    sendPrivateMsg: (msg: string, receiverId: string, imageUrl?: string) => void;
    setSelectedUser: (id: string | null) => void;
    onlineUsers: OnlineUser[];
    logout: () => Promise<void>;
    userName: string | undefined;
    setUsername: (name: string | undefined) => void;
    clearNotification: () => void;
    user: UserData | null;
    selectedUserDatafromServer: UserData | null;
    setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    updateUserData: (newData: Partial<UserData>) => void;
    setSelecteduserDatafromServer: React.Dispatch<React.SetStateAction<UserData | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
    // 1. All States defined at the top level
    const [userId, setUserId] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<MsgData[]>([]);
    const [userName, setUsername] = useState<string | undefined>();
    const [user, setUser] = useState<UserData | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [notification, setNotification] = useState<{ msg: string, senderName: string, senderId: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedUserDatafromServer, setSelecteduserDatafromServer] = useState<UserData | null>(null);
    const notifySound = new Audio('/notification.wav');
    // 2. Callbacks
    const updateUserData = useCallback((newData: Partial<UserData>) => {
        setUser((prev) => (prev ? { ...prev, ...newData } : (newData as UserData)));
    }, []);

    const deleteMsg = useCallback((msg: MsgData) => {
        if (socket && msg._id) {
            socket.emit("delete_msg", { messageId: msg._id, receiverId: msg.receiverId });
        }
    }, [socket]);

    const deleteSenderMessages = useCallback(() => {
        if (socket && selectedUser) {
            socket.emit("delete_sender_messages", { receiverId: selectedUser });
        }
    }, [socket, selectedUser]);

    const clearNotification = useCallback(() => setNotification(null), []);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const res = await api.get("/auth/me");
                if (res.data && res.data.user) {
                    // console.log(res.data.user);
                    setUser(res.data.user);
                    setUserId(res.data.user.id);
                    setUsername(res.data.user.name);
                    // console.log(res.data.user.name);
                    // console.log(res.data.user.id);
                } else {
                    setUser(null);
                    setUserId('');
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setUser(null);
                setUserId('');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);


    useEffect(() => {

        if (!userId || userId === '') {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }
        const newSocket = io("https://m2dd-chatserver.hf.space", {
            withCredentials: true,
            transports: ['websocket'],
            reconnection: true,  
            query: { userId: userId },         // إعادة الاتصال تلقائياً
            reconnectionAttempts: Infinity, // محاولات غير محدودة
            reconnectionDelay: 1000,      // التأخير بين المحاولات
            timeout: 20000,

        });

        newSocket.on("connect", () => {
            setIsConnected(true);
            console.log("Socket connected via Token Cookie ✅");
             newSocket.emit("online_users")
            toast.success(`You are connected `, {
                icon: '✅',
                duration: 1000,
                position: 'top-center',
                style: {
                    borderRadius: '10px',
                    background: '#123405',
                    color: 'yellow',
                },
            });
        });

        newSocket.on("get_history", (history: MsgData[]) => {
            setMessages(history);
        });

        newSocket.on("private_reply", (data: MsgData) => {
            setMessages((prev) => [...prev, data]);
            const incomingSenderId = String(data.senderId).replace(/['"]+/g, '');
            const currentUserId = String(userId).replace(/['"]+/g, '');

            if (incomingSenderId !== currentUserId) {
                setOnlineUsers((currentList) => {
                    const senderObj = currentList.find(u =>
                        String(u.userId).replace(/['"]+/g, '') === incomingSenderId
                    );
                    toast.success(`New message from ${senderObj ? senderObj.name : "Unknown"}`, {
                        icon: '💬',
                        duration: 5000,
                        position: 'top-right',
                        style: {
                            borderRadius: '10px',
                            background: '#123405',
                            color: 'yellow',
                        },
                    });

                    setNotification({
                        msg: data.text || "message is sent",
                        senderName: senderObj ? senderObj.name : "Unknown",
                        senderId: incomingSenderId
                    });


                    notifySound.currentTime = 0; 
        
        // تشغيل الصوت
        notifySound.play().catch(error => {
            // المتصفح قد يمنع الصوت التلقائي إلا بعد أول تفاعل للمستخدم مع الصفحة
            console.warn("Audio play failed (waiting for user interaction):", error);
        });
        if (navigator.vibrate) navigator.vibrate(200); 

                    return currentList;
                });
            }
        });

        newSocket.on("online_users", (users: OnlineUser[]) => setOnlineUsers(users));
        newSocket.on("message_deleted", ({ messageId }) => {
            setMessages((prev) => prev.filter(m => m._id !== messageId));
        });


        newSocket.on("messages_read", ({ readerId }) => {
            setMessages(prev => prev.map(m => {
                if (String(m.receiverId).replace(/['"]+/g, '') === String(readerId)) {
                    return { ...m, seen: true };
                }
                return m;
            }));
        });

        newSocket.on("messages_read_update", ({ readBy }) => {
            setMessages((prev) =>
                prev.map((msg) => {
                    const msgReceiver = String(msg.receiverId || "").replace(/['"]+/g, '');
                    const reader = String(readBy).replace(/['"]+/g, '');
                    return msgReceiver === reader ? { ...msg, seen: true } : msg;
                })
            );
        });

        setSocket(newSocket);

        return () => {
            newSocket.off("messages_read_update");
            newSocket.off("messages_read");
            newSocket.off("private_reply");
            newSocket.off("get_history");
            newSocket.close();
        };
    }, [userId, user?.fulluserImage]);

    // 5. Helper Methods
    const sendPrivateMsg = (msg: string, receiverId: string, imageUrl?: string) => {
        socket?.emit("private_msg", {
            msg,
            receiverId,
            senderId: userId,
            imageUrl: imageUrl || null
        });
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            setUserId('');
            socket?.disconnect();
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };



    return (
        <SocketContext.Provider value={{
            socket, isConnected, messages, clearNotification, sendPrivateMsg, notification,
            userId, sendMsg: (msg) => socket?.emit("chatMsg", msg), setSelectedUser, updateUserData,
            selectedUser, onlineUsers, logout, userName, setUsername, selectedUserDatafromServer,
            deleteMsg, deleteSenderMessages, user, setUserId, setUser, loading, setLoading, setSelecteduserDatafromServer
        }}>
            {children}
        </SocketContext.Provider>
    );
}
