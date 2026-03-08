import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
    receiverId?: string; // اختياري في حالة المجموعة
    roomId?: string;     // معرف الغرفة
    senderName?: string;
    timestamps: string;
    createdAt?: string | Date;
    seen: boolean;
    room: string;
}

export interface UserData {
    id?: string;
    _id: string; 
    name: string;
    email: string;
    userImage?: string;
    fulluserImage?: string;
    fullImageUrl?: string;
    createdAt?: string;
}
export interface GroupData {
    _id: string;
    name: string;
    admin: string;
    members: UserData[];
    groupImage?: string;
}

export interface SocketContextValue {
    setSelecteduserDatafromServer: React.Dispatch<React.SetStateAction<UserData | null>>;
    sendMsg: (msg: MsgData) => void;
    deleteMsg: (msg: MsgData) => void;
    deleteSenderMessages: () => void;
    deleteGroup: (roomId: string) => void;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
    sendPrivateMsg: (msg: string, receiverId: string, imageUrl?: string) => void;
    setSelectedUser: (id: string | null) => void;
    logout: () => Promise<void>;
    setUsername: (name: string | undefined) => void;
    clearNotification: () => void;
    setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    updateUserData: (newData: Partial<UserData>) => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    notification: { msg: string, senderName: string, senderId: string } | null;
    selectedUserDatafromServer: UserData | null;
    userName: string | undefined;
    selectedUser: string | null;
    onlineUsers: OnlineUser[];
    userGroups: GroupData[];
    user: UserData | null;
    allUsers: UserData[];
    socket: Socket | null;
    isConnected: boolean;
    messages: MsgData[];
    loading: boolean;
    userId: string;
    selectedGroup: string | null;
    setSelectedGroup: (id: string | null) => void;
        sendGroupMsg: (msg: string, roomId: string, imageUrl?: string) => void;
    fetchGroups: () => Promise<void>;
   
   
  
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
    const [allUsers, setAllUsers] = useState<UserData[]>([]); 
     const [userGroups, setUserGroups] = useState<GroupData[]>([]);
     const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

const audioRef = useRef(new Audio('/notification.mp3'));
    // get all groups
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await api.get("/auth/groups");
                setUserGroups(res.data.groups || []);
            } catch (err) { console.error("Failed to fetch groups", err); }
        };
        if (userId) fetchGroups();
    }, [userId]);

    // التحقق من الجلسة
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const res = await api.get("/auth/me");
                if (res.data?.user) {
                    console.log( "checkAuth:"+ res.data.user);
                    setUser(res.data.user);
                    setUserId(res.data.user._id || res.data.user.id);
                    setUsername(res.data.user.name);
                }
            } catch (err) { console.error("Auth check failed:", err); }
            finally { setLoading(false); }
        };
        checkAuth();
    }, []);
// get all users
useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await api.get("/auth/all"); // تأكد من مسار الـ API عندك
                setAllUsers(res.data.users || res.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };
        if (userId) fetchAllUsers();
    }, []);

  


    useEffect(() => {

        if (!userId || userId === '') {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }
         const playNotification = () => {
        audioRef.current.play();
        
    };
        const newSocket = io("https://m2dd-serverchatapp.hf.space", {
            withCredentials: true,
            transports: ['websocket'],
            reconnection: true,  
            query: { userId: userId },         // إعادة الاتصال تلقائيا     
            timeout: 20000,

        });

        newSocket.on("connect", () => {
            setIsConnected(true);
            console.log("Socket connected via Token Cookie ✅");
             newSocket.emit("online_users")
            toast.success(`You are connected `, {
                icon: '✅',
                duration: 700,
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
        
newSocket.on("receive_group_msg", (data: MsgData) => {
    if (String(data.senderId) !== String(userId)) {
            playNotification();
        }

 setMessages((prev) => {
                const isDuplicate = prev.some(m => 
                    (m._id && m._id === data._id) || 
                    (m.senderId === data.senderId && m.text === data.text && m.createdAt === data.createdAt)
                );
                
                if (isDuplicate) return prev;
                return [...prev, data];
            });
        });

        newSocket.on("private_reply", (data: MsgData) => {
          
             setMessages((prev) => {
        // منع التكرار في الرسائل الخاصة أيضاً
        const isDuplicate = prev.some(m => m._id === data._id);
        if (isDuplicate) return prev;
        return [...prev, data];
    });
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
       if (String(data.senderId) !== String(userId)) {
            playNotification();
        }
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


    newSocket.on("group_deleted", ({ roomId }) => {
        setUserGroups((prev) => prev.filter(g => g._id !== roomId));
        
        // إذا كان المستخدم يفتح هذه المجموعة حالياً، نغلقها
        if (selectedGroup === roomId) {
            setSelectedGroup(null);
            setMessages([]);
            toast.error("تم حذف هذه المجموعة من قبل المسؤول");
            window.location.href = "/home";
        }
    });




        setSocket(newSocket);

        return () => {
            newSocket.off("messages_read_update");
            newSocket.off("messages_read");
            newSocket.off("private_reply");
            newSocket.off("get_history");
            newSocket.off("receive_group_msg"); 
            newSocket.close();
            newSocket.off("group_deleted")
        };
    }, [userId]);


    // 2. Callbacks
    const updateUserData = useCallback((newData: Partial<UserData>) => {
        setUser((prev) => (prev ? { ...prev, ...newData } : (newData as UserData)));
    }, [userId]);

    const deleteMsg = useCallback((msg: MsgData) => {
        if (socket && msg._id) {
            socket.emit("delete_msg", { messageId: msg._id, receiverId: msg.receiverId });
        }
    }, [socket]);
    const fetchGroups = useCallback(async () => {
    try {
        const res = await api.get("/auth/groups");
        setUserGroups(res.data.groups || []);
    } catch (err) {
        console.error("Failed to fetch groups", err);
    }
}, [userId]);

    const deleteSenderMessages = useCallback(() => {
        console.log( selectedUser);
        if (socket && selectedUser) {
            socket.emit("delete_sender_messages", { receiverId: selectedUser });
        }
    }, [socket, selectedUser]);
    
  
const deleteGroup = useCallback((roomId: string) => {
    if (socket && isConnected) {
        socket.emit("delete_group", { roomId });
    }
}, [socket, isConnected]);



    const clearNotification = useCallback(() => setNotification(null), []);

  
  // دوال الإرسال
    const sendPrivateMsg = useCallback((msg: string, receiverId: string, imageUrl?: string) => {
        if (socket) socket.emit("private_msg", { 
            msg,
            receiverId,
            senderId: userId,
            imageUrl: imageUrl || null });
    }, [socket]);

    const sendGroupMsg = useCallback((msg: string, roomId: string, imageUrl?: string) => {
    if (socket) {
     
        // إرسالها للسيرفر
         socket.emit("send_group_msg", { roomId, msg, imageUrl });
    }
}, [socket, userId]);


    // الانضمام للمجموعة عند اختيارها
    useEffect(() => {
        if (socket && selectedGroup) {
            socket.emit("join_group", { roomId: selectedGroup });
        }
    }, [socket]);

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
    socket, 
    isConnected, 
    messages, 
    clearNotification, 
    sendPrivateMsg, 
    notification,
    allUsers,
    userId, 
    setUserId,
    sendMsg: (msg) => socket?.emit("chatMsg", msg), 
    setSelectedUser, 
    updateUserData,
    selectedUser, 
    onlineUsers, 
    logout, 
    userName, 
    setUsername, 
    selectedUserDatafromServer, 
    sendGroupMsg, 
    userGroups,
    selectedGroup, // تأكد من إضافة هذه
    setSelectedGroup, // تأكد من إضافة هذه
    deleteMsg, 
    deleteSenderMessages, 
    deleteGroup,
    user, 
    setUser, 
    loading, 
    setLoading, 
    setSelecteduserDatafromServer,
    fetchGroups
}}>
    {children}
</SocketContext.Provider>

    );
}
