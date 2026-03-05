import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "./SocketContext";
import { useFormik } from "formik";
import { UsersList } from "./UserList";
import api from "./api";
import ChatLoader from "./ChatLoader";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"; // إضافة Framer Motion
import { Helmet } from 'react-helmet-async';
export function Home() {
  const socketContext = useContext(SocketContext);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
 
  if (!socketContext) return null;

  const {
    selectedUserDatafromServer,
    setSelecteduserDatafromServer,
    sendPrivateMsg,
    messages,
    userId,
    selectedUser,
    onlineUsers,
    user,
    deleteMsg,
    deleteSenderMessages,
    socket,
    loading,
    setLoading
  } = socketContext;

  // تنظيف الـ IDs لضمان دقة المقارنة
  const myId = String(userId || "").replace(/['"]+/g, '');
  const targetId = String(selectedUser || "").replace(/['"]+/g, '');
  const selectedUserData = onlineUsers.find(u => String(u.userId).replace(/['"]+/g, '') === targetId);

const confirmClearChat = () => {
    toast((t) => (
      <div style={{ direction: 'rtl' }}>
        <p className="mb-2">مسح الشات؟</p>
        <button className="btn btn-danger btn-sm me-2" onClick={() => { deleteSenderMessages(); toast.dismiss(t.id); }}>نعم</button>
        <button className="btn btn-light btn-sm" onClick={() => toast.dismiss(t.id)}>إلغاء</button>
      </div>
    ));
  };

  const confirmDeleteMsg = (item: any) => {
    toast((t) => (
      <div className="d-flex" style={{ direction: 'rtl' }}>
        <p className="mb-2 px-2">حذف؟</p>
        <button className="btn btn-danger btn-sm me-2 py-1" onClick={() => { deleteMsg(item); toast.dismiss(t.id); }}>نعم</button>
        <button className="btn btn-light btn-sm py-1" onClick={() => toast.dismiss(t.id)}>إلغاء</button>
      </div>
    ));
  };


  async function getselectedData (selectedUser:any){
   // console.log(selectedUserDatafromServer)
    if (selectedUserDatafromServer?.id === selectedUser) return;
    if(!selectedUser)return
  const res =await api.get('/auth/user',{params:{id:selectedUser}});
  if(res){
    // console.log(res.data.user);
    setSelecteduserDatafromServer(res.data.user);
  }
}


useEffect(() => {
 
  if (selectedUser && socket) {
    socket.emit("get_chat_history", { receiverId: selectedUser });
  }
getselectedData(selectedUser)
}, [selectedUser, socket]); // سيعمل الكود كلما تغير الشخص المختار

 
useEffect(() => {
  if (targetId && socket && messages.length > 0) {
    const hasUnread = messages.some(m => 
      !m.seen && 
      String(m.senderId || m.sender).replace(/['"]+/g, '') === targetId
    );

    if (hasUnread) {

      socket.emit("messages_read", { senderId: targetId });
    }
  }
}, [selectedUser, messages, socket, targetId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);

  const formik = useFormik({
    initialValues: { msg: "" },
    onSubmit: async (values) => {
      if (!values.msg.trim() && !selectedFile) return;
      if (!selectedUser) return;

      let uploadedUrl = "";
      try {
        setIsUploading(true);
        if (selectedFile) {
          const formData = new FormData();
          formData.append("image", selectedFile);
          setLoading(true);
          const res = await api.post("/imageMessage", formData);
          uploadedUrl = res.data.imageUrl;
          setLoading(false);
        }
        sendPrivateMsg(values.msg, selectedUser, uploadedUrl);
        formik.resetForm();
        setSelectedFile(null);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    },
  });


  return (<>
  <Helmet>
        <title>chatnow </title>
        <meta name="description" content="chat now with friends " />
      </Helmet>
  {loading?<ChatLoader/>:<div className="container-fluid vh-100 p-0 overflow-hidden bg-light" style={{ marginTop: '60px' }}>
      <div className="row g-0 h-100">
        {/* <div className="col-md-4 col-lg-3 border-end bg-white d-none d-md-block h-100 overflow-auto shadow-sm">
          <div className="p-3 bg-primary text-white d-flex align-items-center justify-content-between">
            <h5 className="mb-0 fw-bold">المحادثات</h5>
            <i className="fa-solid fa-message"></i>
          </div>
          <UsersList />
        </div> */}
         <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="col-md-4 col-lg-3 border-end bg-white d-none d-md-block h-100 overflow-auto shadow-sm"
            >
              <div className="p-3 bg-primary text-white d-flex align-items-center justify-content-between">
                <h5 className="mb-0 fw-bold">المحادثات</h5>
                <i className="fa-solid fa-message"></i>
              </div>
              <UsersList />
            </motion.div>

        <div className="col-md-8 col-lg-9 h-100 d-flex flex-column bg-chat-pattern">
          {selectedUser ? (
            <>
               <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-2 bg-white border-bottom shadow-sm d-flex align-items-center justify-content-between px-3 z-3"
                  >
                <div className="d-flex align-items-center">
                  <div className="position-relative">
                  {selectedUserDatafromServer && selectedUserDatafromServer.fulluserImage ?
                  <>
                  <img src={selectedUserDatafromServer?.fulluserImage} 
                  className="rounded-circle" alt="Profile" 
                  style={{ width: "45px", height: "45px", objectFit: "cover" }} />
                  </> 
                  :<div className="rounded-circle bg-light border d-flex align-items-center justify-content-center overflow-hidden" style={{ width: "45px", height: "45px" }}>
                    <i className="fa-solid fa-user fa-xl text-secondary mt-2"></i>
                    </div>
                  }
                    
                    <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle shadow-sm"></span>
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0 fw-bold">{selectedUserData?.name.split(' ').slice(0,2).join(" ") || "مستخدم"}</h6>
                    <small className="text-success fw-medium">متصل الآن</small>
                  </div>
                </div>
   
  <div className="d-flex align-items-center gap-3">
 

    <button 
       onClick={confirmClearChat} 
      className="btn btn-outline-danger btn-sm rounded-pill border-0 shadow-sm"
    >
      <i className="fa-solid fa-trash-can"></i>
    </button> 
  </div></motion.div>

    
              <div className="flex-grow-1 overflow-auto p-4 custom-scrollbar bg-messages-area">
                 <AnimatePresence initial={false}>
                {messages.map((item, index) => {
                  const isMe = String(item?.senderId || item?.sender).replace(/['"]+/g, '') === myId;
                  return (
                    <motion.div key={item._id || index} // يفضل استخدام id الرسالة لو متاح
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                    className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"} mb-3 animate__animated animate__fadeInUp`}
                    >
                      <div className={`p-2 shadow-sm message-bubble ${isMe ? "bg-primary text-white bubble-me" : "bg-white text-dark bubble-them"}`}
                        style={{ maxWidth: "70%", borderRadius: "15px", position: "relative" }}>

                        {item.imageUrl && (
                          <img src={item.imageUrl} className="img-fluid rounded mb-2 d-block cursor-pointer" style={{ maxHeight: "300px" }} onClick={() => window.open(item.imageUrl, '_blank')} alt="sent" />
                        )}

                        <div className="d-flex align-items-end gap-2 px-1">
                          <p className="mb-0 fw-medium" style={{ fontSize: '0.92rem', wordBreak: 'break-word' }}>{item.text}</p>
                          <small className="opacity-75" style={{ fontSize: '0.65rem' }}>
                            {new Date((item as any).createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>

                          {isMe && (
                            <span className="ms-1" style={{ fontSize: '0.75rem' }}>
                              {item.seen ? (
                                <i className="fa-solid fa-check-double text-info" style={{ color: '#34B7F1' }}></i>
                              ) : (
                                <i className="fa-solid fa-check opacity-50"></i>
                              )}
                            </span>
                          )}

                        </div>

                        {isMe && (
                          <button onClick={() => confirmDeleteMsg(item)} 
                          className="btn-delete-msg"><i className="fa-solid fa-xmark"></i></button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}</AnimatePresence>
                <div ref={scrollRef} />
              </div>

              <div className="p-3 bg-white border-top shadow-lg">
                <form onSubmit={formik.handleSubmit} className="d-flex align-items-center gap-2">
                  <label htmlFor="chat-file" className={`btn ${selectedFile ? 'btn-success' : 'btn-light'} rounded-circle shadow-sm d-flex align-items-center justify-content-center`} style={{ width: '42px', height: '42px', cursor: 'pointer' }}>
                    <i className={`fa-solid ${selectedFile ? "fa-check" : "fa-plus"}`}></i>
                  </label>
                  <input id="chat-file" type="file" className="d-none" accept="image/*" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} />
                  <input {...formik.getFieldProps('msg')} className="form-control rounded-pill border-0 bg-light px-4 py-2" placeholder="اكتب رسالة..." autoComplete="off" />
                  <button type="submit" disabled={isUploading} className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '45px', height: '45px' }}>
                    {isUploading ? <span className="spinner-border spinner-border-sm"></span> : <i className="fa-solid fa-paper-plane"></i>}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted bg-white">
              <div className="rounded-circle bg-light shadow-sm p-5 mb-4 border animate__animated animate__pulse animate__infinite">
                <i className="fa-solid fa-comments fa-5x text-primary opacity-50"></i>
              </div>
              <h4 className="fw-bold text-dark">Welcome {user?.name.split(' ').slice(0,2).join(" ")}!</h4>
              <p>choose a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .bg-chat-pattern { background-color: #e5ddd5; position: relative; }
        .bg-messages-area {
          background-image: url("https://user-images.githubusercontent.com");
          background-blend-mode: overlay; background-color: rgba(229, 221, 213, 0.9);
        }
        .bubble-me { border-bottom-right-radius: 2px !important; background-color: #b7e1c6 !important; color: #000 !important; }
        .bubble-them { border-bottom-left-radius: 2px !important; }
        .btn-delete-msg { position: absolute; top: -10px; right: -10px; background: #ff4d4d; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 10px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; cursor: pointer; }
        .message-bubble:hover .btn-delete-msg { opacity: 1; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #bbb; border-radius: 10px; }
      `}</style>
    </div>}
  
  </>
    


  )

  
}
// import { useContext, useEffect, useRef, useState } from "react";
// import { SocketContext } from "./SocketContext";
// import { useFormik } from "formik";
// import { UsersList } from "./UserList";
// import api from "./api";
// import ChatLoader from "./ChatLoader";
// import toast from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion"; 
// import { Helmet } from 'react-helmet-async';

// export function Home() {
//   const socketContext = useContext(SocketContext);
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
 
//   if (!socketContext) return null;

//   const {
//     selectedUserDatafromServer,
//     setSelecteduserDatafromServer,
//     sendPrivateMsg,
//     sendGroupMsg, // إضافة دالة إرسال المجموعات
//     messages,
//     userId,
//     selectedUser,
//     selectedGroup, // إضافة معرف المجموعة المختارة
//     userGroups,    // قائمة المجموعات
//     onlineUsers,
//     setSelectedGroup,
//      setSelectedUser,
//     deleteMsg,
//     deleteSenderMessages,
//     socket,
//     loading,
//     setLoading
//   } = socketContext;

//   const myId = String(userId || "").replace(/['"]+/g, '');
//   const targetId = String(selectedUser || "").replace(/['"]+/g, '');
  
//   // تحديد بيانات الطرف الآخر (سواء كان مستخدم أو مجموعة)
//   const selectedUserData = onlineUsers.find(u => String(u.userId).replace(/['"]+/g, '') === targetId);
//   const currentGroupData = userGroups?.find(g => String(g._id) === String(selectedGroup));

//   const confirmClearChat = () => {
//     toast((t) => (
//       <div style={{ direction: 'rtl' }}>
//         <p className="mb-2">مسح الشات؟</p>
//         <button className="btn btn-danger btn-sm me-2" onClick={() => { deleteSenderMessages(); toast.dismiss(t.id); }}>نعم</button>
//         <button className="btn btn-light btn-sm" onClick={() => toast.dismiss(t.id)}>إلغاء</button>
//       </div>
//     ));
//   };

//   const confirmDeleteMsg = (item: any) => {
//     toast((t) => (
//       <div className="d-flex" style={{ direction: 'rtl' }}>
//         <p className="mb-2 px-2">حذف؟</p>
//         <button className="btn btn-danger btn-sm me-2 py-1" onClick={() => { deleteMsg(item); toast.dismiss(t.id); }}>نعم</button>
//         <button className="btn btn-light btn-sm py-1" onClick={() => toast.dismiss(t.id)}>إلغاء</button>
//       </div>
//     ));
//   };

//   async function getselectedData (selectedUser:any){
//     if (selectedUserDatafromServer?.id||selectedUserDatafromServer?._id === selectedUser) return;
//     if(!selectedUser) return;
//     const res = await api.get('/auth/user',{params:{id:selectedUser}});
//     console.log(res);
//     if(res) setSelecteduserDatafromServer(res.data.user);
//   }


//   useEffect(() => {
//     if (selectedUser && socket) {
//       socket.emit("get_chat_history", { receiverId: selectedUser });
//       getselectedData(selectedUser);
//     }
//   }, [selectedUser, socket]);

//   useEffect(() => {
//     if (targetId && socket && messages.length > 0) {
//       const hasUnread = messages.some(m => 
//         !m.seen && 
//         String(m.senderId || m.sender).replace(/['"]+/g, '') === targetId
//       );
//       if (hasUnread) socket.emit("messages_read", { senderId: targetId });
//     }
//   }, [selectedUser, messages, socket, targetId]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const formik = useFormik({
//     initialValues: { msg: "" },
//     onSubmit: async (values) => {
//       if (!values.msg.trim() && !selectedFile) return;
//       if (!selectedUser && !selectedGroup) return; // تعديل الشرط ليشمل المجموعة

//       let uploadedUrl = "";
//       try {
//         setIsUploading(true);
//         if (selectedFile) {
//           const formData = new FormData();
//           formData.append("image", selectedFile);
//           setLoading(true);
//           const res = await api.post("/imageMessage", formData);
//           uploadedUrl = res.data.imageUrl;
//           setLoading(false);
//         }

//         // إرسال الرسالة بناءً على النوع (خاص أو مجموعة)
//         if (selectedGroup) {
//           sendGroupMsg(values.msg, selectedGroup, uploadedUrl);
//         } else if (selectedUser) {
//           sendPrivateMsg(values.msg, selectedUser, uploadedUrl);
//         }

//         formik.resetForm();
//         setSelectedFile(null);
//       } catch (error) {
//         console.error("Upload failed:", error);
//       } finally {
//         setIsUploading(false);
//       }
//     },
//   });
//   // أضف هذا الـ Effect داخل ملف Home.tsx
// useEffect(() => {
//   if (selectedGroup && socket) {
//     // إبلاغ السوكيت بالانضمام للروم وجلب تاريخها
//     socket.emit("join_group", { roomId: selectedGroup });
//   }
// }, [selectedGroup, socket]);


//   return (<>
//     <Helmet>
//       <title>chatnow</title>
//       <meta name="description" content="chat now with friends " />
//     </Helmet>
//     {loading ? <ChatLoader/> : <div className="container-fluid vh-100 p-0 overflow-hidden bg-light" style={{ marginTop: '60px' }}>
//       <div className="row g-0 h-100">
//         <motion.div 
//           initial={{ x: -50, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           className="col-md-4 col-lg-3 border-end bg-white d-none d-md-block h-100 overflow-auto shadow-sm"
//         >
//           <div className="p-3 bg-primary text-white d-flex align-items-center justify-content-between">
//             <h5 className="mb-0 fw-bold">المحادثات</h5>
//             <i className="fa-solid fa-message"></i>
//           </div>
//          <motion.div 
//   initial={{ x: -50, opacity: 0 }}
//   animate={{ x: 0, opacity: 1 }}
//   className="col-md-4 col-lg-3 border-end bg-white d-none d-md-block h-100 overflow-auto shadow-sm"
// >
//   <div className="p-3 bg-primary text-white d-flex align-items-center justify-content-between">
//     <h5 className="mb-0 fw-bold">{selectedGroup ? "أعضاء المجموعة" : "المحادثات"}</h5>
//     <i className={`fa-solid ${selectedGroup ? "fa-users" : "fa-message"}`}></i>
//   </div>

//   {selectedGroup ? (
//     // عرض أعضاء المجموعة فقط عند الدخول لروم
//     <div className="list-group list-group-flush">
//       {currentGroupData?.members?.map((member: any) => (
//         <div key={member._id} className="list-group-item border-0 d-flex align-items-center py-3">
//           <img 
//             src={member.fulluserImage || "/default-avatar.png"} 
//             className="rounded-circle me-3" 
//             style={{ width: "35px", height: "35px", objectFit: "cover" }} 
//             alt="" 
//           />
//           <span className="fw-bold small">{member.name}</span>
//           {/* علامة التاج للأدمن */}
//           {member._id === currentGroupData.admin && <i className="fa-solid fa-crown text-warning ms-auto fa-xs"></i>}
//         </div>
//       ))}
//       <button 
//         className="btn btn-light btn-sm m-3 rounded-pill" 
//         onClick={() => { setSelectedGroup(null); setSelectedUser(null); }}
//       >
//         العودة للكل
//       </button>
//     </div>
//   ) : (
//     <UsersList />
//   )}
// </motion.div>

//         </motion.div>

//         <div className="col-md-8 col-lg-9 h-100 d-flex flex-column bg-chat-pattern">
//           {(selectedUser || selectedGroup) ? (
//             <>
//               <motion.div 
//                 initial={{ y: -20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 className="p-2 bg-white border-bottom shadow-sm d-flex align-items-center justify-content-between px-3 z-3"
//               >
//                 <div className="d-flex align-items-center">
//                   <div className="position-relative">
//                     {/* عرض صورة المجموعة أو المستخدم */}
//                     {selectedGroup ? (
//                       <div className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center overflow-hidden shadow-sm" style={{ width: "45px", height: "45px" }}>
//                         <i className="fa-solid fa-users text-primary"></i>
//                       </div>
//                     ) : (
//                       selectedUserDatafromServer?.fulluserImage ? (
//                         <img src={selectedUserDatafromServer.fulluserImage} className="rounded-circle shadow-sm" alt="Profile" style={{ width: "45px", height: "45px", objectFit: "cover" }} />
//                       ) : (
//                         <div className="rounded-circle bg-light border d-flex align-items-center justify-content-center overflow-hidden" style={{ width: "45px", height: "45px" }}>
//                           <i className="fa-solid fa-user fa-xl text-secondary mt-2"></i>
//                         </div>
//                       )
//                     )}
//                     {!selectedGroup && <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle shadow-sm"></span>}
//                   </div>
//                   <div className="ms-3">
//                     <h6 className="mb-0 fw-bold">
//                       {selectedGroup ? currentGroupData?.name : (selectedUserData?.name.split(' ').slice(0,2).join(" ") || "مستخدم")}
//                     </h6>
//                     <small className={selectedGroup ? "text-muted" : "text-success fw-medium"}>
//                       {selectedGroup ? `${currentGroupData?.members?.length || 0} أعضاء` : "متصل الآن"}
//                     </small>
//                   </div>
//                 </div>
   
//                 <div className="d-flex align-items-center gap-3">
//                   {!selectedGroup && (
//                     <button onClick={confirmClearChat} className="btn btn-outline-danger btn-sm rounded-pill border-0 shadow-sm">
//                       <i className="fa-solid fa-trash-can"></i>
//                     </button>
//                   )}
//                 </div>
//               </motion.div>

//               <div className="flex-grow-1 overflow-auto p-4 custom-scrollbar bg-messages-area d-flex flex-column">
//                 <AnimatePresence initial={false}>
//                   {messages.map((item, index) => {
//                     const isMe = String(item?.senderId || item?.sender).replace(/['"]+/g, '') === myId;
//                     return (
//                       <motion.div 
//                         key={item._id || index}
//                         initial={{ opacity: 0, y: 15, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         transition={{ duration: 0.2 }}
//                         className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"} mb-3`}
//                       >
//                         <div className={`p-2 shadow-sm message-bubble position-relative ${isMe ? "bg-primary text-white bubble-me" : "bg-white text-dark bubble-them"}`} 
//                              onContextMenu={(e) => { e.preventDefault(); isMe && confirmDeleteMsg(item); }}
//                              style={{ maxWidth: '75%', borderRadius: '15px' }}>
                          
//                           {/* عرض اسم المرسل في المجموعات فقط */}
//                           {selectedGroup && !isMe && item.senderName && (
//                             <div className="fw-bold mb-1" style={{ fontSize: '10px', color: '#6610f2' }}>{item.senderName}</div>
//                           )}

//                           {item.imageUrl && <img src={item.imageUrl} className="rounded mb-2 w-100 shadow-sm" alt="msg" />}
//                           <p className="mb-1 small px-1">{item.text}</p>
//                           <div className="d-flex justify-content-end align-items-center" style={{ fontSize: '9px', opacity: 0.8 }}>
//                             <span>{new Date(item.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                             {isMe && !selectedGroup && (
//                               <i className={`fa-solid fa-check-double ms-1 ${item.seen ? "text-info" : "text-light"}`}></i>
//                             )}
//                           </div>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                   <div ref={scrollRef} />
//                 </AnimatePresence>
//               </div>

//               {/* فورم الإرسال */}
//               <div className="p-3 bg-white border-top shadow-sm z-3">
//                 <form onSubmit={formik.handleSubmit} className="d-flex align-items-center gap-2">
//                   <label className="btn btn-light rounded-circle shadow-sm m-0 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
//                     <i className={`fa-solid ${selectedFile ? "fa-check text-success" : "fa-paperclip text-muted"}`}></i>
//                     <input type="file" className="d-none" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} />
//                   </label>
//                   <input
//                     type="text"
//                     name="msg"
//                     className="form-control rounded-pill border-0 bg-light px-4 shadow-none py-2"
//                     placeholder="اكتب رسالتك..."
//                     value={formik.values.msg}
//                     onChange={formik.handleChange}
//                   />
//                   <button type="submit" className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} disabled={isUploading}>
//                     {isUploading ? <span className="spinner-border spinner-border-sm"></span> : <i className="fa-solid fa-paper-plane"></i>}
//                   </button>
//                 </form>
//               </div>
//             </>
//           ) : (
//             <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
//                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
//                  <i className="fa-solid fa-comments fa-4x mb-3 opacity-25"></i>
//                  <h5>ابدأ الدردشة الآن</h5>
//                  <p className="small">اختر صديقاً أو مجموعة لبدء التواصل</p>
//                </motion.div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>}
//   </>);
// }
