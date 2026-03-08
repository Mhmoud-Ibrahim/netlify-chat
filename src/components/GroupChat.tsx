// import { useContext, useEffect, useRef, useState } from "react";
// import { SocketContext } from "./SocketContext";
// import { useFormik } from "formik";
// import api from "./api";
// import ChatLoader from "./ChatLoader";
// import { motion, AnimatePresence } from "framer-motion";
// import { Helmet } from 'react-helmet-async';
// import toast from "react-hot-toast";
// export function GroupChat() {
//   const socketContext = useContext(SocketContext);
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);

//   if (!socketContext) return null;

//   const {
//     sendGroupMsg,
//     messages,
//     userId,
//     selectedGroup,
//     userGroups,
//     socket,
//     loading,
//     setLoading,
//     deleteGroup
//   } = socketContext;

//   const myId = String(userId || "").replace(/['"]+/g, '');

//   // بيانات المجموعة الحالية
//   const currentGroupData = userGroups?.find(g => String(g._id).replace(/['"]+/g, '') === String(selectedGroup).replace(/['"]+/g, ''));

//   // الانضمام للغرفة فور تغيير المجموعة
//   useEffect(() => {
//     if (selectedGroup && socket) {
//       socket.emit("join_group", { roomId: selectedGroup });
//     }
//   }, [selectedGroup, socket]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const formik = useFormik({
//     initialValues: { msg: "" },
//     onSubmit: async (values) => {
//       if (!values.msg.trim() && !selectedFile) return;
//       if (!selectedGroup) return;

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
//         sendGroupMsg(values.msg, selectedGroup, uploadedUrl);
//         formik.resetForm();
//         setSelectedFile(null);
//       } catch (error) {
//         console.error("Upload failed:", error);
//       } finally {
//         setIsUploading(false);
//       }
//     },
//   });


//   const uniqueMessages = Array.from(new Map(
//     messages
//       .filter(m => String(m.room || m.roomId) === String(selectedGroup))
//       .map((m, index) => [m._id || `temp-${index}`, m])
//   ).values());




//   const confirmDeleteGoupe = () => {
//     // التأكد أولاً من وجود مجموعة مختارة
//     if (!selectedGroup) {
//       return toast.error("يرجى اختيار مجموعة أولاً");
//     }

//     toast((t) => (
//       <div style={{ direction: 'rtl', textAlign: 'right' }}>
//         <p className="mb-3 fw-bold text-dark">⚠️ هل أنت متأكد من حذف هذه المجموعة نهائياً؟</p>
//         <div className="d-flex justify-content-end gap-2">
//           <button
//             className="btn btn-danger btn-sm px-3"
//             onClick={() => {
//               // نمرر الـ ID الخاص بالمجموعة المختارة حالياً
//               deleteGroup(selectedGroup);
//               toast.dismiss(t.id);
//             }}
//           >
//             نعم، احذف
//           </button>
//           <button
//             className="btn btn-light btn-sm px-3"
//             onClick={() => toast.dismiss(t.id)}
//           >
//             إلغاء
//           </button>
//         </div>
//       </div>
//     ), {
//       duration: 6000, // وقت كافٍ للمستخدم ليقرر
//       position: 'top-center',
//       style: { borderRadius: '12px', border: '1px solid #eee' }
//     });
//   };

//   return (<>
//     <Helmet>
//       <title>Group Chat - {currentGroupData?.name || "ChatNow"}</title>
//     </Helmet>

//     {loading ? <ChatLoader /> : <div className="container-fluid vh-100 p-0 overflow-hidden bg-light" style={{ marginTop: '60px' }}>
//       <div className="row g-0 h-100">

//         {/* العمود الجانبي: يعرض أعضاء المجموعة المضافين فقط */}
//         <motion.div
//           initial={{ x: -50, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           className="col-md-4 col-lg-3 border-end bg-white d-none d-md-block h-100 overflow-auto shadow-sm"
//         >
//           <div className="p-3 bg-primary text-white shadow-sm">
//             <h6 className="mb-0 fw-bold"><i className="fa-solid fa-users-rays me-2"></i>أعضاء المجموعة</h6>
//           </div>
//           <div className="list-group list-group-flush custom-scrollbar">
//             {currentGroupData?.members?.map((member: any) => (
//               <div key={member._id} className="list-group-item border-0 d-flex align-items-center py-3 px-3 border-bottom transition-all">
//                 <div className="rounded-circle overflow-hidden border border-2 border-warning shadow-sm me-3" style={{ width: '38px', height: '38px' }}>
//                   <img src={member.fulluserImage || member.userImage || "/default-avatar.png"} className="w-100 h-100 object-fit-cover" alt="" />
//                 </div>
//                 <div className="text-start">
//                   <div className="fw-bold small text-dark">{member.name}</div>
//                   {member._id === currentGroupData.admin && <small className="text-warning fw-bold" style={{ fontSize: '9px' }}>مسئول المجموعة</small>}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </motion.div>

//         <div className="col-md-8 col-lg-9 h-100 d-flex flex-column bg-chat-pattern">
//           {selectedGroup ? (
//             <>
//               <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-2 bg-white border-bottom shadow-sm d-flex align-items-center justify-content-between px-3 z-3">
//                 <div className="d-flex align-items-center">
//                   <div className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center overflow-hidden shadow-sm" style={{ width: "45px", height: "45px" }}>
//                     <i className="fa-solid fa-users-group fa-xl text-primary"></i>
//                   </div>
//                   <div className="ms-3 text-start">
//                     <h6 className="mb-0 fw-bold text-dark">{currentGroupData?.name}</h6>
//                     <small className="text-muted small">{currentGroupData?.members?.length || 0} عضو مضاف</small>
//                   </div>
//                   <button
//                     onClick={confirmDeleteGoupe}
//                     className="btn btn-outline-danger btn-sm rounded-pill border-0 shadow-sm"
//                   >
//                     <i className="fa-solid fa-trash-can"></i>
//                   </button>
//                 </div>
//               </motion.div>

//               <div className="flex-grow-1 overflow-auto p-4 custom-scrollbar bg-messages-area d-flex flex-column">
//                 <AnimatePresence initial={false}>

//                   {uniqueMessages.length > 0 ? (
//                     uniqueMessages.map((item, index) => {
//                       const isMe = String(item?.senderId || item?.sender).replace(/['"]+/g, '') === myId;

//                       const msgKey = item._id ? String(item._id) : `temp-${index}-${Date.now()}`;

//                       return (
         
//                         <motion.div
//                           key={msgKey}
//                           initial={{ opacity: 0, y: 15, scale: 0.95 }}
//                           animate={{ opacity: 1, y: 0, scale: 1 }}
//                           transition={{ duration: 0.2 }}
//                           className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"} mb-3`}
//                         >
//                           <div className={`p-2 shadow-sm message-bubble ${isMe ? "bg-primary text-white bubble-me" : "bg-white text-dark bubble-them"}`}
//                             style={{ maxWidth: "70%", borderRadius: "15px", position: "relative" }}>

//                             {!isMe && (
//                               <div className="fw-bold mb-1" style={{ fontSize: '10px', color: '#6610f2' }}>
//                                 {currentGroupData?.members?.find(
//                                   (m: any) => String(m._id) === String(item.senderId || item.sender)
//                                 )?.name || "عضو"}
//                               </div>
//                             )}

//                             {item.imageUrl && <img src={item.imageUrl} className="w-100 rounded mb-2 shadow-sm" alt="" />}
//                             <p className="mb-1 small px-1 text-start">{item.text}</p>

//                             <div className="d-flex justify-content-end align-items-center" style={{ fontSize: '9px', opacity: 0.8 }}>
//                               <span>{new Date(item.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                             </div>
//                           </div>
//                           <div className="d-flex align-items-center gap-3">



//                           </div>
//                         </motion.div>
//                       );
//                     })
//                   ) : (
//                    <div className="d-flex flex-column align-items-center justify-content-center h-100 opacity-50">
//         <i className="fa-solid fa-comments fa-3x mb-3 text-muted"></i>
//         <p className="fw-bold text-muted">thre is no messages yet ...</p>
//       </div>
//                   )}
//                   <div ref={scrollRef} />
//                 </AnimatePresence>
//               </div>

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
//                     placeholder="اكتب رسالة للمجموعة..."
//                     value={formik.values.msg}
//                     onChange={formik.handleChange}
//                     autoComplete="off"
//                   />
//                   <button type="submit" className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} disabled={isUploading}>
//                     <i className="fa-solid fa-paper-plane"></i>
//                   </button>
//                 </form>
//               </div>
//             </>
//           ) : (
//             <div className="h-100 d-flex align-items-center justify-content-center text-muted">
//               <h5>برجاء اختيار مجموعة للبدء</h5>
//             </div>
//           )}
//         </div>
//       </div>
//       <style>{`
//         .bg-chat-pattern { background-color: #e5ddd5; position: relative; }
//         .bg-messages-area {
//           background-image: url("https://user-images.githubusercontent.com");
//           background-blend-mode: overlay; background-color: rgba(229, 221, 213, 0.9);
//         }
//         .bubble-me { border-bottom-right-radius: 2px !important; background-color: #b7e1c6 !important; color: #000 !important; }
//         .bubble-them { border-bottom-left-radius: 2px !important; }
//         .btn-delete-msg { position: absolute; top: -10px; right: -10px; background: #ff4d4d; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 10px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; cursor: pointer; }
//         .message-bubble:hover .btn-delete-msg { opacity: 1; }
//         .custom-scrollbar::-webkit-scrollbar { width: 5px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #bbb; border-radius: 10px; }
//       `}</style>
//     </div>}
//   </>);
// }
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "./SocketContext";
import { useFormik } from "formik";
import api from "./api";
import ChatLoader from "./ChatLoader";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from 'react-helmet-async';
import toast from "react-hot-toast";

export function GroupChat() {
  const socketContext = useContext(SocketContext);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!socketContext) return null;

  const {
    sendGroupMsg,
    messages,
    userId,
    selectedGroup,
    userGroups,
    socket,
    loading,
    setLoading,
    deleteGroup
  } = socketContext;

  const myId = String(userId || "").replace(/['"]+/g, '');

  // بيانات المجموعة الحالية
  const currentGroupData = userGroups?.find(g => String(g._id).replace(/['"]+/g, '') === String(selectedGroup).replace(/['"]+/g, ''));

  // الانضمام للغرفة فور تغيير المجموعة
  useEffect(() => {
    if (selectedGroup && socket) {
      socket.emit("join_group", { roomId: selectedGroup });
    }
  }, [selectedGroup, socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formik = useFormik({
    initialValues: { msg: "" },
    onSubmit: async (values) => {
      if (!values.msg.trim() && !selectedFile) return;
      if (!selectedGroup) return;

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
        sendGroupMsg(values.msg, selectedGroup, uploadedUrl);
        formik.resetForm();
        setSelectedFile(null);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    },
  });

  const uniqueMessages = Array.from(new Map(
    messages
      .filter(m => String(m.room || m.roomId) === String(selectedGroup))
      .map((m, index) => [m._id || `temp-${index}`, m])
  ).values());

  const confirmDeleteGoupe = () => {
    if (!selectedGroup) {
      return toast.error("يرجى اختيار مجموعة أولاً");
    }

    toast((t) => (
      <div style={{ direction: 'rtl', textAlign: 'right' }}>
        <p className="mb-3 fw-bold text-dark">⚠️ هل أنت متأكد من حذف هذه المجموعة نهائياً؟</p>
        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-danger btn-sm px-3"
            onClick={() => {
              deleteGroup(selectedGroup);
              toast.dismiss(t.id);
            }}
          >
            نعم، احذف
          </button>
          <button
            className="btn btn-light btn-sm px-3"
            onClick={() => toast.dismiss(t.id)}
          >
            إلغاء
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: { borderRadius: '12px', border: '1px solid #eee' }
    });
  };

  return (<>
    <Helmet>
      <title>Group Chat - {currentGroupData?.name || "ChatNow"}</title>
    </Helmet>

    {loading ? <ChatLoader /> : <div className="container-fluid vh-100 p-0 overflow-hidden bg-light" style={{ marginTop: '60px' }}>
      <div className="row g-0 h-100">

        {/* العمود الجانبي */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="col-md-4 col-lg-3 border-end bg-white d-none d-md-block h-100 overflow-auto shadow-sm"
        >
          <div className="p-3 bg-primary text-white shadow-sm">
            <h6 className="mb-0 fw-bold"><i className="fa-solid fa-users-rays me-2"></i>أعضاء المجموعة</h6>
          </div>
          <div className="list-group list-group-flush custom-scrollbar">
            {currentGroupData?.members?.map((member: any) => (
              <div key={member._id} className="list-group-item border-0 d-flex align-items-center py-3 px-3 border-bottom transition-all">
                <div className="rounded-circle overflow-hidden border border-2 border-warning shadow-sm me-3" style={{ width: '38px', height: '38px' }}>
                  <img src={member.fulluserImage || member.userImage || "/default-avatar.png"} className="w-100 h-100 object-fit-cover" alt="" />
                </div>
                <div className="text-start">
                  <div className="fw-bold small text-dark">{member.name}</div>
                  {member._id === currentGroupData.admin && <small className="text-warning fw-bold" style={{ fontSize: '9px' }}>مسئول المجموعة</small>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* منطقة المحادثة */}
        <div className="col-md-8 col-lg-9 h-100 d-flex flex-column bg-chat-pattern">
          {selectedGroup ? (
            <>
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-2 bg-white border-bottom shadow-sm d-flex align-items-center justify-content-between px-3 z-3">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center overflow-hidden shadow-sm" style={{ width: "45px", height: "45px" }}>
                    <i className="fa-solid fa-users-group fa-xl text-primary"></i>
                  </div>
                  <div className="ms-3 text-start">
                    <h6 className="mb-0 fw-bold text-dark">{currentGroupData?.name}</h6>
                    <small className="text-muted small">{currentGroupData?.members?.length || 0} عضو مضاف</small>
                  </div>
                </div>
                <button
                    onClick={confirmDeleteGoupe}
                    className="btn btn-outline-danger btn-sm rounded-pill border-0 shadow-sm"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                </button>
              </motion.div>

              <div className="flex-grow-1 overflow-auto p-4 custom-scrollbar bg-messages-area d-flex flex-column">
                <AnimatePresence initial={false}>
                  {uniqueMessages.length > 0 ? (
                    uniqueMessages.map((item, index) => {
                      const isMe = String(item?.senderId || item?.sender).replace(/['"]+/g, '') === myId;
                      const msgKey = item._id ? String(item._id) : `temp-${index}-${Date.now()}`;

                      return (
                        <motion.div
                          key={msgKey}
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"} mb-3`}
                        >
                          <div className={`p-2 shadow-sm message-bubble ${isMe ? "bg-primary text-white bubble-me" : "bg-white text-dark bubble-them"}`}
                            style={{ maxWidth: "70%", borderRadius: "15px", position: "relative" }}>

                            {!isMe && (
                              <div className="fw-bold mb-1" style={{ fontSize: '10px', color: '#6610f2' }}>
                                {currentGroupData?.members?.find(
                                  (m: any) => String(m._id) === String(item.senderId || item.sender)
                                )?.name || "عضو"}
                              </div>
                            )}

                            {item.imageUrl && (
                              <img src={item.imageUrl} className="w-100 rounded-3 mb-2 shadow-sm" alt="msg" style={{maxHeight:'300px', objectFit:'cover'}} />
                            )}
                            
                            <p className="m-0 p-1" style={{ wordBreak: "break-word" }}>{item.text}</p>
                            
                            <div className={`text-end ${isMe ? "text-white-50" : "text-muted"}`} style={{ fontSize: "9px", marginTop: "2px" }}>
                              {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    /* هذا هو الجزء المسؤول عن رسالة "لا توجد رسائل" */
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="h-100 d-flex flex-column align-items-center justify-content-center opacity-50"
                    >
                      <i className="fa-solid fa-comments fa-4x mb-3 text-muted"></i>
                      <p className="fw-bold text-muted">لا توجد رسائل في هذه المجموعة بعد</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={scrollRef} />
              </div>

              {/* منطقة الإدخال */}
              <div className="p-3 bg-white border-top shadow-lg">
                {selectedFile && (
                  <div className="mb-2 p-2 bg-light rounded d-flex align-items-center justify-content-between border">
                    <span className="small text-truncate me-2"><i className="fa-solid fa-image me-1"></i>{selectedFile.name}</span>
                    <button className="btn btn-sm btn-danger py-0" onClick={() => setSelectedFile(null)}>×</button>
                  </div>
                )}
                <form onSubmit={formik.handleSubmit} className="d-flex align-items-center gap-2">
                  <button type="button" className="btn btn-light rounded-circle shadow-sm" onClick={() => fileInputRef.current?.click()}>
                    <i className="fa-solid fa-paperclip text-primary"></i>
                  </button>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                  
                  <input
                    name="msg"
                    className="form-control rounded-pill border-0 bg-light px-4 shadow-inner"
                    placeholder="اكتب رسالتك هنا..."
                    autoComplete="off"
                    onChange={formik.handleChange}
                    value={formik.values.msg}
                  />
                  
                  <button type="submit" disabled={isUploading} className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px" }}>
                    {isUploading ? <span className="spinner-border spinner-border-sm"></span> : <i className="fa-solid fa-paper-plane"></i>}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
              <i className="fa-solid fa-comments fa-5x mb-4 opacity-25"></i>
              <h4 className="fw-bold">اختر مجموعة لبدء الدردشة</h4>
            </div>
          )}
        </div>
      </div>
    </div>}
    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
  </>);
}

// تعريف الـ Ref الخاص بـ Input الملفات
const fileInputRef = { current: null as HTMLInputElement | null };
