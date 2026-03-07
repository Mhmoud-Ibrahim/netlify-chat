// import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
// import { io, Socket } from "socket.io-client";
// import api from "./api";
// import toast from 'react-hot-toast';
// // --- Interfaces ---
// export interface OnlineUser {
//     userId: string;
//     name: string;
//     userImage?: string;
//     fulluserImage?: string;
// }

// export interface MsgData {
//     text: string;
//     sender: string;
//     imageUrl?: string;
//     senderId: string;
//     _id?: string;
//     receiverId?: string; // اختياري في حالة المجموعة
//     roomId?: string;     // معرف الغرفة
//     senderName?: string;
//     timestamps: string;
//     createdAt?: string | Date;
//     seen: boolean;
// }

// export interface UserData {
//     id?: string;
//     _id: string; 
//     name: string;
//     email: string;
//     userImage?: string;
//     fulluserImage?: string;
//     createdAt?: string;
// }
// export interface GroupData {
//     _id: string;
//     name: string;
//     admin: string;
//     members: UserData[];
//     groupImage?: string;
// }

// export interface SocketContextValue {
//     setSelecteduserDatafromServer: React.Dispatch<React.SetStateAction<UserData | null>>;
//     sendMsg: (msg: MsgData) => void;
//     deleteMsg: (msg: MsgData) => void;
//     deleteSenderMessages: () => void;
//     setUserId: React.Dispatch<React.SetStateAction<string>>;
//     sendPrivateMsg: (msg: string, receiverId: string, imageUrl?: string) => void;
//     setSelectedUser: (id: string | null) => void;
//     logout: () => Promise<void>;
//     setUsername: (name: string | undefined) => void;
//     clearNotification: () => void;
//     setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
//     updateUserData: (newData: Partial<UserData>) => void;
//     setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//     notification: { msg: string, senderName: string, senderId: string } | null;
//     selectedUserDatafromServer: UserData | null;
//     userName: string | undefined;
//     selectedUser: string | null;
//     onlineUsers: OnlineUser[];
//     userGroups: GroupData[];
//     user: UserData | null;
//     allUsers: UserData[];
//     socket: Socket | null;
//     isConnected: boolean;
//     messages: MsgData[];
//     loading: boolean;
//     userId: string;
//     selectedGroup: string | null;
//     setSelectedGroup: (id: string | null) => void;
//         sendGroupMsg: (msg: string, roomId: string, imageUrl?: string) => void;
//     fetchGroups: () => Promise<void>;
 
// }

//  export const SocketContext = createContext<SocketContextValue | null>(null);

// export function SocketProvider({ children }: { children: ReactNode }) {
//     const [userId, setUserId] = useState('');
//     const [socket, setSocket] = useState<Socket | null>(null);
//     const [isConnected, setIsConnected] = useState(false);
//     const [messages, setMessages] = useState<MsgData[]>([]);
//     const [userName, setUsername] = useState<string | undefined>();
//     const [user, setUser] = useState<UserData | null>(null);
//     const [selectedUser, setSelectedUser] = useState<string | null>(null);
//     const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
//     const [notification, setNotification] = useState<{ msg: string, senderName: string, senderId: string } | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [selectedUserDatafromServer, setSelecteduserDatafromServer] = useState<UserData | null>(null);
//     const [allUsers, setAllUsers] = useState<UserData[]>([]); 
//      const [userGroups, setUserGroups] = useState<GroupData[]>([]);
//      const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    
//      const fetchGroups = useCallback(async () => {
//         try {
//             const res = await api.get("/auth/groups");
//             setUserGroups(res.data.groups || []);
//         } catch (err) { console.error("Failed to fetch groups", err); }
//     }, [userId]);

//   useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 setLoading(true);
//                 const res = await api.get("/auth/me");
//                 if (res.data?.user) {
//                     const u = res.data.user;
//                     setUser(u);
//                     setUserId(u._id || u.id);
//                     setUsername(u.name);
//                 }
//             } catch (err) {
//                 console.error("Auth check failed:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         checkAuth();
//     }, []);

// useEffect(() => {
//         if (!userId) return;
//         const fetchInitialData = async () => {
//             try {
//                 const resUsers = await api.get("/auth/all");
//                 setAllUsers(resUsers.data.users || resUsers.data);
//                 await fetchGroups();
//             } catch (err) { console.error("Data fetch error", err); }
//         };
//         fetchInitialData();
//     }, [userId, fetchGroups]);

//       useEffect(() => {
//         const fetchGroups = async () => {
//             try {
//                 const res = await api.get("/auth/groups");
//                 setUserGroups(res.data.groups || []);
//             } catch (err) { console.error("Failed to fetch groups", err); }
//         };
//         if (userId) fetchGroups();
//     }, [userId]);
// const notifySound = new Audio('/notification.mp3');
//  useEffect(() => {
//         if (!userId) {
//             if (socket) { 
//                 socket.disconnect();
//                  setSocket(null); }
//             return;
//         }

//         const newSocket = io("https://m2dd-serverchatapp.hf.space", {
//             withCredentials: true,
//             transports: ['websocket'],
//             reconnection: true,  
//             query: { userId: userId },
//             reconnectionAttempts: Infinity,
//             timeout: 20000,
//         });

//         newSocket.on("connect", () => {
//             setIsConnected(true);
//             newSocket.emit("online_users");
//             toast.success(`You are connected`, {
//                 duration: 700,
//                 position: 'top-center',
//                 style: { borderRadius: '10px', background: '#123405', color: 'yellow' },
//             });
//         });

//         newSocket.on("disconnect", () => setIsConnected(false));

//         newSocket.on("get_history", (history: MsgData[]) => {
//             setMessages(history);
//         });

//         newSocket.on("receive_group_msg", (data: MsgData) => {
//             setMessages((prev) => [...prev, data]);
//             if (data.senderId !== userId) {
//                 notifySound.play().catch(() => {});
//             }
//         });

//         newSocket.on("private_reply", (data: MsgData) => {
//             setMessages((prev) => [...prev, data]);
//             const incomingId = String(data.senderId).replace(/['"]+/g, '');
//             const currentId = String(userId).replace(/['"]+/g, '');

//             if (incomingId !== currentId) {
//                 const sender = onlineUsers.find(u => String(u.userId).replace(/['"]+/g, '') === incomingId);
//                 setNotification({
//                     msg: data.text || "New Image",
//                     senderName: sender ? sender.name : "Unknown",
//                     senderId: incomingId
//                 });
//                 notifySound.play().catch(() => {});
//             }
//         });

//         setSocket(newSocket);
//         return () => { newSocket.disconnect(); };
//     }, [userId]);

// //     const notifySound = new Audio('/notification.mp3');
// //     useEffect(() => {

// //         if (!userId || userId === '') {
// //             if (socket) {
// //                 socket.disconnect();
// //                 setSocket(null);
// //             }
// //             return;
// //         }
// //         const newSocket = io("https://m2dd-serverchatapp.hf.space", {
// //             withCredentials: true,
// //             transports: ['websocket'],
// //             reconnection: true,  
// //             query: { userId: userId },         // إعادة الاتصال تلقائياً
// //             reconnectionAttempts: Infinity, // محاولات غير محدودة
// //             reconnectionDelay: 1000,      
// //             timeout: 20000,

// //         });

// //         newSocket.on("connect", () => {
// //             setIsConnected(true);
// //             console.log("Socket connected via Token Cookie ✅");
// //              newSocket.emit("online_users")
// //             toast.success(`You are connected `, {
// //                 icon: '✅',
// //                 duration: 700,
// //                 position: 'top-center',
// //                 style: {
// //                     borderRadius: '10px',
// //                     background: '#123405',
// //                     color: 'yellow',
// //                 },
// //             });
// //         });
// //          newSocket.on("disconnect", () => setIsConnected(false));

// //         newSocket.on("get_history", (history: MsgData[]) => {
// //             setMessages(history);
// //         });

// //            newSocket.on("receive_group_msg", (data: MsgData) => {
// //             setMessages((prev) => [...prev, data]);
// //             if (data.senderId !== userId) {
// //                  const sound = new Audio('/notification.mp3'); 
// //         sound.play().catch(() => console.log("Audio play deferred"));
// //             }
// //         });

// //         newSocket.on("private_reply", (data: MsgData) => {
// //             setMessages((prev) => [...prev, data]);
// //             const incomingSenderId = String(data.senderId).replace(/['"]+/g, '');
// //             const currentUserId = String(userId).replace(/['"]+/g, '');

// //             if (incomingSenderId !== currentUserId) {
// //                 setOnlineUsers((currentList) => {
// //                     const senderObj = currentList.find(u =>
// //                         String(u.userId).replace(/['"]+/g, '') === incomingSenderId
// //                     );
// //                     toast.success(`New message from ${senderObj ? senderObj.name : "Unknown"}`, {
// //                         icon: '💬',
// //                         duration: 5000,
// //                         position: 'top-right',
// //                         style: {
// //                             borderRadius: '10px',
// //                             background: '#123405',
// //                             color: 'yellow',
// //                         },
// //                     });
// //                     setNotification({
// //                         msg: data.text || "message is sent",
// //                         senderName: senderObj ? senderObj.name : "Unknown",
// //                         senderId: incomingSenderId
// //                     });
// //                     notifySound.currentTime = 0; 
// //         notifySound.play().catch(error => { 
// //             console.warn("Audio play failed (waiting for user interaction):", error);
// //         });
// //         if (navigator.vibrate) navigator.vibrate(200); 
// //                     return currentList;
// //                 });
// //             }
// //         });

// //         newSocket.on("online_users", (users: OnlineUser[]) => setOnlineUsers(users));
       
// //         newSocket.on("message_deleted", ({ messageId }) => {
// //             setMessages((prev) => prev.filter(m => m._id !== messageId));
// //         });


// //         newSocket.on("messages_read", ({ readerId }) => {
// //             setMessages(prev => prev.map(m => {
// //                 if (String(m.receiverId).replace(/['"]+/g, '') === String(readerId)) {
// //                     return { ...m, seen: true };
// //                 }
// //                 return m;
// //             }));
// //         });

// //         newSocket.on("messages_read_update", ({ readBy }) => {
// //             setMessages((prev) =>
// //                 prev.map((msg) => {
// //                     const msgReceiver = String(msg.receiverId || "").replace(/['"]+/g, '');
// //                     const reader = String(readBy).replace(/['"]+/g, '');
// //                     return msgReceiver === reader ? { ...msg, seen: true } : msg;
// //                 })
// //             );
// //         });

// //         setSocket(newSocket);

// //         return () => {
// //             newSocket.off("messages_read_update");
// //             newSocket.off("messages_read");
// //             newSocket.off("private_reply");
// //             newSocket.off("get_history");
// //             newSocket.off("receive_group_msg"); 
// //             newSocket.close();
// //         };
// //     }, [userId, user?.fulluserImage]);


// //     // 2. Callbacks
// //     const updateUserData = useCallback((newData: Partial<UserData>) => {
// //         setUser((prev) => (prev ? { ...prev, ...newData } : (newData as UserData)));
// //     }, []);

// //     const deleteMsg = useCallback((msg: MsgData) => {
// //         if (socket && msg._id) {
// //             socket.emit("delete_msg", { messageId: msg._id, receiverId: msg.receiverId });
// //         }
// //     }, [socket]);
// //     const fetchGroups = useCallback(async () => {
// //     try {
// //         const res = await api.get("/auth/groups");
// //         setUserGroups(res.data.groups || []);
// //     } catch (err) {
// //         console.error("Failed to fetch groups", err);
// //     }
// // }, []);


// //     const deleteSenderMessages = useCallback(() => {
// //         if (socket && selectedUser) {
// //             socket.emit("delete_sender_messages", { receiverId: selectedUser });
// //         }
// //     }, [socket, selectedUser]);

// //     const clearNotification = useCallback(() => setNotification(null), []);

  
 
// //     const sendPrivateMsg = useCallback((msg: string, receiverId: string, imageUrl?: string) => {
// //         if (socket) socket.emit("private_msg", { msg,
// //             receiverId,
// //             senderId: userId,
// //             imageUrl: imageUrl || null });
// //     }, [socket]);

// //     const sendGroupMsg = useCallback((msg: string, roomId: string, imageUrl?: string) => {
// //         if (socket) socket.emit("send_group_msg", { msg, roomId, imageUrl });
// //     }, [socket]);

   
// //     useEffect(() => {
// //         if (socket && selectedGroup) {
// //             socket.emit("join_group", { roomId: selectedGroup });
// //         }
// //     }, [socket, selectedGroup]);

// //     const logout = async () => {
// //         try {
// //             await api.post('/auth/logout');
// //             setUser(null);
// //             setUserId('');
// //             socket?.disconnect();
// //             window.location.href = "/login";
// //         } catch (error) {
// //             console.error("Logout failed", error);
// //         }
// //     };



// //     return (
// //         <SocketContext.Provider value={{
// //     socket, 
// //     isConnected, 
// //     messages, 
// //     clearNotification, 
// //     sendPrivateMsg, 
// //     notification,
// //     allUsers,
// //     userId, 
// //     setUserId,
// //     sendMsg: (msg) => socket?.emit("chatMsg", msg), 
// //     setSelectedUser, 
// //     updateUserData,
// //     selectedUser, 
// //     onlineUsers, 
// //     logout, 
// //     userName, 
// //     setUsername, 
// //     selectedUserDatafromServer, 
// //     sendGroupMsg, 
// //     userGroups,
// //     selectedGroup, 
// //     setSelectedGroup, 
// //     deleteMsg, 
// //     deleteSenderMessages, 
// //     user, 
// //     setUser, 
// //     loading, 
// //     setLoading, 
// //     setSelecteduserDatafromServer,
// //     fetchGroups
// // }}>
// //     {children}
// // </SocketContext.Provider>

// //     );
// // }



//     // 2. التحقق من الجلسة (مرة واحدة)
  

//     // 3. جلب البيانات التكميلية عند توفر userId
    

//     // 4. إعداد السوكيت
//     // useEffect(() => {
//     //     if (!userId) {
//     //         if (socket) { socket.disconnect(); setSocket(null); }
//     //         return;
//     //     }

//     //     const newSocket = io("https://m2dd-serverchatapp.hf.space", {
//     //         withCredentials: true,
//     //         transports: ['websocket'],
//     //         reconnection: true,  
//     //         query: { userId: userId },
//     //         reconnectionAttempts: Infinity,
//     //         timeout: 20000,
//     //     });

//     //     newSocket.on("connect", () => {
//     //         setIsConnected(true);
//     //         newSocket.emit("online_users");
//     //         toast.success(`You are connected`, {
//     //             duration: 700,
//     //             position: 'top-center',
//     //             style: { borderRadius: '10px', background: '#123405', color: 'yellow' },
//     //         });
//     //     });

//     //     newSocket.on("disconnect", () => setIsConnected(false));

//     //     newSocket.on("get_history", (history: MsgData[]) => {
//     //         setMessages(history);
//     //     });

//     //     newSocket.on("receive_group_msg", (data: MsgData) => {
//     //         setMessages((prev) => [...prev, data]);
//     //         if (data.senderId !== userId) {
//     //             notifySound.play().catch(() => {});
//     //         }
//     //     });

//     //     newSocket.on("private_reply", (data: MsgData) => {
//     //         setMessages((prev) => [...prev, data]);
//     //         const incomingId = String(data.senderId).replace(/['"]+/g, '');
//     //         const currentId = String(userId).replace(/['"]+/g, '');

//     //         if (incomingId !== currentId) {
//     //             const sender = onlineUsers.find(u => String(u.userId).replace(/['"]+/g, '') === incomingId);
//     //             setNotification({
//     //                 msg: data.text || "New Image",
//     //                 senderName: sender ? sender.name : "Unknown",
//     //                 senderId: incomingId
//     //             });
//     //             notifySound.play().catch(() => {});
//     //         }
//     //     });

//     //     setSocket(newSocket);
//     //     return () => { newSocket.disconnect(); };
//     // }, [userId]);

//     // --- الوظائف المفعلة (تصليح مشكلة رفع الصور) ---
//       const sendPrivateMsg = useCallback((msg: string, receiverId: string, imageUrl?: string) => {
//         if (socket) socket.emit("private_msg", { msg,
//              receiverId,
//             senderId:userId,
//             imageUrl: imageUrl || '' });
//     }, [socket]);

//   const sendGroupMsg = useCallback((msg: string, roomId: string, imageUrl?: string) => {
//          if (socket) socket.emit("send_group_msg", { msg, roomId, imageUrl });
//      }, [socket]);

//     const sendMsg = (msg: MsgData) => {
//         if (socket) socket.emit("send_msg", msg);
//     };

//     const deleteMsg = (msg: MsgData) => {
//         if (socket) socket.emit("delete_msg", { messageId: msg._id, receiverId: msg.receiverId });
//     };

//     const deleteSenderMessages = () => {
//         if (socket && selectedUser) socket.emit("delete_sender_messages", { receiverId: selectedUser });
//     };

//     const logout = async () => {
//         try {
//             await api.post("/auth/logout");
//             setUserId('');
//             setUser(null);
//             if (socket) socket.disconnect();
//         } catch (err) { console.error(err); }
//     };

//     const clearNotification = () => setNotification(null);
//     const updateUserData = (newData: Partial<UserData>) => setUser(prev => prev ? {...prev, ...newData} : null);

//     const value: SocketContextValue = {
//         setSelecteduserDatafromServer,
//         sendMsg,
//         deleteMsg,
//         deleteSenderMessages,
//         setUserId,
//         sendPrivateMsg,
//         setSelectedUser,
//         logout,
//         setUsername,
//         clearNotification,
//         setUser,
//         updateUserData,
//         setLoading,
//         notification,
//         selectedUserDatafromServer,
//         userName,
//         selectedUser,
//         onlineUsers,
//         userGroups,
//         user,
//         allUsers,
//         socket,
//         isConnected,
//         messages,
//         loading,
//         userId,
//         selectedGroup,
//         setSelectedGroup,
//         sendGroupMsg,
//         fetchGroups
//     };

//     return (
//         <SocketContext.Provider value={value}>
//             {children}
//         </SocketContext.Provider>
//     );
// }
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
    receiverId?: string; 
    roomId?: string;     
    senderName?: string;
    timestamps: string;
    createdAt?: string | Date;
    seen: boolean;
}

export interface UserData {
    id?: string;
    _id: string; 
    name: string;
    email: string;
    userImage?: string;
    fulluserImage?: string;
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

    const notifySound = new Audio('/notification.mp3');

    // 1. جلب المجموعات
    const fetchGroups = useCallback(async () => {
        try {
            const res = await api.get("/auth/groups");
            setUserGroups(res.data.groups || []);
        } catch (err) { console.error("Failed to fetch groups", err); }
    }, []);

    // 2. التحقق من الهوية
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const res = await api.get("/auth/me");
                if (res.data?.user) {
                    const u = res.data.user;
                    setUser(u);
                    setUserId(u._id || u.id);
                    setUsername(u.name);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    // 3. جلب بيانات المستخدمين فور تسجيل الدخول
    useEffect(() => {
        if (!userId) return;
        const fetchInitialData = async () => {
            try {
                const resUsers = await api.get("/auth/all");
                setAllUsers(resUsers.data.users || resUsers.data);
                await fetchGroups();
            } catch (err) { console.error("Data fetch error", err); }
        };
        fetchInitialData();
    }, [userId, fetchGroups]);

    // 4. السوكيت ومعالجة الرسائل (بما فيها الصور)
    useEffect(() => {
        if (!userId) {
            if (socket) { socket.disconnect(); setSocket(null); }
            return;
        }

        const newSocket = io("https://m2dd-serverchatapp.hf.space", {
            withCredentials: true,
            transports: ['websocket'],
            reconnection: true,  
            query: { userId: userId },
            reconnectionAttempts: Infinity,
            timeout: 20000,
        });

        newSocket.on("connect", () => {
            setIsConnected(true);
            newSocket.emit("online_users");
            toast.success(`You are connected`, {
                duration: 700,
                position: 'top-center',
                style: { borderRadius: '10px', background: '#123405', color: 'yellow' },
            });
            
        });
      newSocket.on("online_users", (usersList: OnlineUser[]) => {
        setOnlineUsers(usersList);
     });

        newSocket.on("disconnect", () => setIsConnected(false));

        newSocket.on("get_history", (history: MsgData[]) => {
            setMessages(history);
        });

        newSocket.on("receive_group_msg", (data: MsgData) => {
            setMessages((prev) => [...prev, data]);
            if (data.senderId !== userId) notifySound.play().catch(() => {});
        });

        newSocket.on("private_reply", (data: MsgData) => {
            setMessages((prev) => [...prev, data]);
            const incomingId = String(data.senderId).replace(/['"]+/g, '');
            if (incomingId !== String(userId).replace(/['"]+/g, '')) {
                const sender = onlineUsers.find(u => String(u.userId).replace(/['"]+/g, '') === incomingId);
                setNotification({
                    msg: data.text || "New Image 📸",
                    senderName: sender ? sender.name : "Unknown",
                    senderId: incomingId
                });
                notifySound.play().catch(() => {});
            }
        });

        setSocket(newSocket);
        return () => { newSocket.disconnect(); };
    }, [userId]);

    // --- الدوال الأساسية للإرسال والتحكم ---
    const sendPrivateMsg = (msg: string, receiverId: string, imageUrl?: string) => {
        if (socket) socket.emit("private_msg", { msg, receiverId, imageUrl });
    };

    const sendGroupMsg = (msg: string, roomId: string, imageUrl?: string) => {
        if (socket) socket.emit("send_group_msg", { roomId, msg, imageUrl });
    };

    const sendMsg = (msg: MsgData) => {
        if (socket) socket.emit("send_msg", msg);
    };

    const deleteMsg = (msg: MsgData) => {
        if (socket) socket.emit("delete_msg", { messageId: msg._id, receiverId: msg.receiverId });
    };

    const deleteSenderMessages = () => {
        if (socket && selectedUser) socket.emit("delete_sender_messages", { receiverId: selectedUser });
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
            setUserId('');
            setUser(null);
            if (socket) socket.disconnect();
        } catch (err) { console.error(err); }
    };

    const clearNotification = () => setNotification(null);
    const updateUserData = (newData: Partial<UserData>) => setUser(prev => prev ? {...prev, ...newData} : null);

    const value: SocketContextValue = {
        setSelecteduserDatafromServer,
        sendMsg,
        deleteMsg,
        deleteSenderMessages,
        setUserId,
        sendPrivateMsg,
        setSelectedUser,
        logout,
        setUsername,
        clearNotification,
        setUser,
        updateUserData,
        setLoading,
        notification,
        selectedUserDatafromServer,
        userName,
        selectedUser,
        onlineUsers,
        userGroups,
        user,
        allUsers,
        socket,
        isConnected,
        messages,
        loading,
        userId,
        selectedGroup,
        setSelectedGroup,
        sendGroupMsg,
        fetchGroups
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}
