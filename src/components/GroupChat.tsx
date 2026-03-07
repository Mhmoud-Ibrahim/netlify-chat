// // import { useContext, useEffect, useRef, useState } from "react";
// // import { SocketContext } from "./SocketContext";
// // import { useFormik } from "formik";
// // import api from "./api";
// // import ChatLoader from "./ChatLoader";
// // //import toast from "react-hot-toast";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { Helmet } from 'react-helmet-async';
// // import { GroupsList } from "./GroupsList";

// // export function GroupChat() {
// //   const socketContext = useContext(SocketContext);
// //   const scrollRef = useRef<HTMLDivElement>(null);
// //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //   const [isUploading, setIsUploading] = useState(false);

// //   if (!socketContext) return null;

// //   const {
// //     sendGroupMsg,
// //     messages,
// //     userId,
// //     selectedGroup,
// //     userGroups,
// //     socket,
// //     loading,
// //     setLoading
// //   } = socketContext;

// //   const myId = String(userId || "").replace(/['"]+/g, '');

// //   // جلب بيانات الجروب الحالي
// //   const currentGroupData = userGroups?.find(g => String(g._id).replace(/['"]+/g, '') === String(selectedGroup).replace(/['"]+/g, ''));

// //   // 1. تصفير الرسائل القديمة والانضمام للروم فور تغيير الجروب
// //   useEffect(() => {
// //     if (selectedGroup && socket) {
// //       // إبلاغ السوكيت بالانضمام للروم لضمان استقبال receive_group_msg
// //       socket.emit("join_group", { roomId: selectedGroup });
// //     }
// //   }, [selectedGroup, socket]);

// //   useEffect(() => {
// //     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   const formik = useFormik({
// //     initialValues: { msg: "" },
// //     onSubmit: async (values) => {
// //       if (!values.msg.trim() && !selectedFile) return;
// //       if (!selectedGroup) return;

// //       let uploadedUrl = "";
// //       try {
// //         setIsUploading(true);
// //         if (selectedFile) {
// //           const formData = new FormData();
// //           formData.append("image", selectedFile);
// //           setLoading(true);
// //           const res = await api.post("/imageMessage", formData);
// //           uploadedUrl = res.data.imageUrl;
// //           setLoading(false);
// //         }
        
// //         // إرسال الرسالة للمجموعة
// //         sendGroupMsg(values.msg, selectedGroup, uploadedUrl);
        
// //         formik.resetForm();
// //         setSelectedFile(null);
// //       } catch (error) {
// //         console.error("Upload failed:", error);
// //       } finally {
// //         setIsUploading(false);
// //       }
// //     },
// //   });

// //   // 2. فلترة الرسائل لعرض رسائل هذه المجموعة فقط
// //   const groupMessages = messages.filter(m => 
// //     m.roomId && String(m.roomId).replace(/['"]+/g, '') === String(selectedGroup).replace(/['"]+/g, '')
// //   );

// //   return (<>
// //     <Helmet>
// //       <title>Group Chat - ChatNow</title>
// //     </Helmet>

// //     {loading ? <ChatLoader /> : <div className="container-fluid vh-100 p-0 overflow-hidden bg-light" style={{ marginTop: '60px' }}>
// //       <div className="row g-0 h-100">
      
// //         <motion.div 
// //           initial={{ x: -50, opacity: 0 }}
// //           animate={{ x: 0, opacity: 1 }}
// //           className="col-md-4 col-lg-3 border-end bg-white d-none d-md-block h-100 overflow-auto shadow-sm"
// //         >
// //           {/* <div className="p-3 bg-primary text-white d-flex align-items-center justify-content-between">
// //             <h5 className="mb-0 fw-bold">المجموعات</h5>
// //             <i className="fa-solid fa-layer-group"></i>
// //           </div> */}
// //           <GroupsList /> 
// //         </motion.div>

// //         <div className="col-md-8 col-lg-9 h-100 d-flex flex-column bg-chat-pattern">
// //           {selectedGroup ? (
// //             <>
// //               <motion.div
// //                 initial={{ y: -20, opacity: 0 }}
// //                 animate={{ y: 0, opacity: 1 }}
// //                 className="p-2 bg-white border-bottom shadow-sm d-flex align-items-center justify-content-between px-3 z-3"
// //               >
// //                 <div className="d-flex align-items-center">
// //                   <div className="position-relative">
// //                     <div className="rounded-circle bg-primary-subtle border d-flex align-items-center justify-content-center overflow-hidden" style={{ width: "45px", height: "45px" }}>
// //                       {currentGroupData?.groupImage ? (
// //                         <img src={currentGroupData.groupImage} className="w-100 h-100 object-fit-cover" alt="Group" />
// //                       ) : (
// //                         <i className="fa-solid fa-users fa-xl text-primary mt-1"></i>
// //                       )}
// //                     </div>
// //                   </div>
// //                   <div className="ms-3 text-start">
// //                     <h6 className="mb-0 fw-bold text-dark">{currentGroupData?.name || "اسم المجموعة"}</h6>
// //                     <small className="text-muted small">{currentGroupData?.members?.length || 0} عضو</small>
// //                   </div>
// //                 </div>
// //               </motion.div>

// //               <div className="flex-grow-1 overflow-auto p-4 custom-scrollbar bg-messages-area">
// //                 <AnimatePresence initial={false}>
// //                   {groupMessages.length > 0 ? (
// //                     groupMessages.map((item, index) => {
// //                       const isMe = String(item?.senderId || item?.sender).replace(/['"]+/g, '') === myId;
// //                        {console.log(item,index)}
// //                         return (
// //                         <motion.div
                        
// //                           key={item._id || index}
// //                           initial={{ opacity: 0, y: 15, scale: 0.95 }}
// //                           animate={{ opacity: 1, y: 0, scale: 1 }}
// //                           transition={{ duration: 0.2 }}
// //                           className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"} mb-3`}
// //                         >
// //                           <div className={`p-2 shadow-sm message-bubble ${isMe ? "bg-primary text-white bubble-me" : "bg-white text-dark bubble-them"}`}
// //                             style={{ maxWidth: "70%", borderRadius: "15px", position: "relative" }}>

// //                             {!isMe && (
// //                               <div className="fw-bold mb-1" style={{ fontSize: '10px', color: '#6610f2' }}>
// //                                 {item.senderName || "عضو"}
// //                               </div>
// //                             )}

// //                             {item.imageUrl && <img src={item.imageUrl} className="w-100 rounded mb-2 shadow-sm" alt="" />}
// //                             <p className="mb-1 small px-1 text-start">{item.text}</p>
                            
// //                             <div className="d-flex justify-content-end align-items-center" style={{ fontSize: '9px', opacity: 0.8 }}>
// //                               <span>{new Date(item.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
// //                             </div>
// //                           </div>
// //                         </motion.div>
// //                       );
// //                     })
// //                   ) : (
// //                     <div className="h-100 d-flex align-items-center justify-content-center text-muted opacity-50">
// //                       <p>لا توجد رسائل في هذه المجموعة بعد</p>
// //                     </div>
// //                   )}
// //                   <div ref={scrollRef} />
// //                 </AnimatePresence>
// //               </div>

// //               <div className="p-3 bg-white border-top shadow-sm z-3">
// //                 <form onSubmit={formik.handleSubmit} className="d-flex align-items-center gap-2">
// //                   <label className="btn btn-light rounded-circle shadow-sm m-0 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
// //                     <i className={`fa-solid ${selectedFile ? "fa-check text-success" : "fa-paperclip text-muted"}`}></i>
// //                     <input type="file" className="d-none" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} />
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="msg"
// //                     className="form-control rounded-pill border-0 bg-light px-4 shadow-none py-2"
// //                     placeholder="اكتب رسالة للمجموعة..."
// //                     value={formik.values.msg}
// //                     onChange={formik.handleChange}
// //                     autoComplete="off"
// //                   />
// //                   <button type="submit" className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} disabled={isUploading}>
// //                     <i className="fa-solid fa-paper-plane"></i>
// //                   </button>
// //                 </form>
// //               </div>
// //             </>
// //           ) : (
// //             <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
// //               <i className="fa-solid fa-layer-group fa-4x mb-3 opacity-25"></i>
// //               <h5>اختر مجموعة للبدء</h5>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>}
// //   </>);
// // }
// import { useContext, useEffect, useRef, useState } from "react";
// import { SocketContext } from "./SocketContext";
// import { useFormik } from "formik";
// import api from "./api";
// import ChatLoader from "./ChatLoader";
// import { motion, AnimatePresence } from "framer-motion";
// import { Helmet } from 'react-helmet-async';

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
//     setLoading
//   } = socketContext;

//   const myId = String(userId || "").replace(/['"]+/g, '');

//   // بيانات الجروب الحالي
//   const currentGroupData = userGroups?.find(g => String(g._id).replace(/['"]+/g, '') === String(selectedGroup).replace(/['"]+/g, ''));

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

//   // فلترة الرسائل الخاصة بالجروب الحالي فقط
//   const groupMessages = messages.filter(m => 
//     m.roomId && String(m.roomId).replace(/['"]+/g, '') === String(selectedGroup).replace(/['"]+/g, '')
//   );
//   const uniqueGroupMessages = Array.from(new Map(
//   groupMessages.map(msg => [msg._id || Math.random(), msg])
// ).values());

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
//           <div className="p-3 bg-primary text-white">
//             <h6 className="mb-0 fw-bold"><i className="fa-solid fa-users me-2"></i>أعضاء المجموعة</h6>
//           </div>
//           <div className="list-group list-group-flush">
//             {currentGroupData?.members?.map((member: any) => (
//               <div key={member._id} className="list-group-item border-0 d-flex align-items-center py-3 border-bottom">
//                 <div className="rounded-circle overflow-hidden border border-2 border-warning shadow-sm me-3" style={{ width: '35px', height: '35px' }}>
//                   <img src={member.fulluserImage || member.userImage || "/default-avatar.png"} className="w-100 h-100 object-fit-cover" alt="" />
//                 </div>
//                 <div className="text-start">
//                   <div className="fw-bold small text-dark">{member.name}</div>
//                   {member._id === currentGroupData.admin && <small className="text-warning" style={{fontSize:'9px'}}>مسئول المجموعة</small>}
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
//                     <i className="fa-solid fa-users fa-xl text-primary"></i>
//                   </div>
//                   <div className="ms-3 text-start">
//                     <h6 className="mb-0 fw-bold text-dark">{currentGroupData?.name}</h6>
//                     <small className="text-muted small">{currentGroupData?.members?.length} عضو مضاف</small>
//                   </div>
//                 </div>
//               </motion.div>

//               <div className="flex-grow-1 overflow-auto p-4 custom-scrollbar bg-messages-area">
//                 <div className="flex-grow-1 overflow-auto p-4 custom-scrollbar bg-messages-area d-flex flex-column">
//   <AnimatePresence initial={false}>
//     {groupMessages.length > 0 ? (
//       groupMessages.map((item, index) => {
//         const isMe = String(item?.senderId || item?.sender).replace(/['"]+/g, '') === myId;
        
//         // حل جذري: نجمع بين المعرف، وقت الإنشاء، والترتيب (Index) لضمان مفتاح فريد تماماً
//         const messageKey = item._id 
//           ? `msg-${item._id}` 
//           : `temp-${index}-${item.senderId || 'unknown'}-${new Date(item.createdAt || Date.now()).getTime()}`;

//         return (
//           <motion.div
//             key={messageKey} // 👈 استخدام المفتاح المولد هنا يمنع خطأ Duplicate Key
//             initial={{ opacity: 0, y: 15, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             transition={{ duration: 0.2 }}
//             className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"} mb-3`}
//           >
//             <div className={`p-2 shadow-sm message-bubble ${isMe ? "bg-primary text-white bubble-me" : "bg-white text-dark bubble-them"}`}
//               style={{ maxWidth: "70%", borderRadius: "15px", position: "relative" }}>

//               {!isMe && (
//                 <div className="fw-bold mb-1" style={{ fontSize: '10px', color: '#6610f2' }}>
//                   {item.senderName || "عضو"}
//                 </div>
//               )}

//               {item.imageUrl && <img src={item.imageUrl} className="w-100 rounded mb-2 shadow-sm" alt="" />}
//               <p className="mb-1 small px-1 text-start">{item.text}</p>
              
//               <div className="d-flex justify-content-end align-items-center" style={{ fontSize: '9px', opacity: 0.8 }}>
//                 <span>{new Date(item.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//               </div>
//             </div>
//           </motion.div>
//         );
//       })
//     ) : (
//       <div className="h-100 d-flex align-items-center justify-content-center text-muted opacity-50">
//         <p>لا توجد رسائل بعد</p>
//       </div>
//     )}
//     <div ref={scrollRef} />
//   </AnimatePresence>
// </div>

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
//           ) : null}
//         </div>
//       </div>
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
    setLoading
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

  // 1. تصفية الرسائل المكررة بناءً على الـ _id (لحذف التكرار الناتج عن السوكيت)
  const uniqueMessages = Array.from(new Map(
    messages
      .filter(m => m.roomId && String(m.roomId).replace(/['"]+/g, '') === String(selectedGroup).replace(/['"]+/g, ''))
      .map(m => [m._id || `${m.senderId}-${m.createdAt}`, m])
  ).values());

  return (<>
    <Helmet>
      <title>Group Chat - {currentGroupData?.name || "ChatNow"}</title>
    </Helmet>

    {loading ? <ChatLoader /> : <div className="container-fluid vh-100 p-0 overflow-hidden bg-light" style={{ marginTop: '60px' }}>
      <div className="row g-0 h-100">
        
        {/* العمود الجانبي: يعرض أعضاء المجموعة المضافين فقط */}
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
                  {member._id === currentGroupData.admin && <small className="text-warning fw-bold" style={{fontSize:'9px'}}>مسئول المجموعة</small>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

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
                                {item.senderName || "عضو"}
                              </div>
                            )}

                            {item.imageUrl && <img src={item.imageUrl} className="w-100 rounded mb-2 shadow-sm" alt="" />}
                            <p className="mb-1 small px-1 text-start">{item.text}</p>
                            
                            <div className="d-flex justify-content-end align-items-center" style={{ fontSize: '9px', opacity: 0.8 }}>
                              <span>{new Date(item.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="h-100 d-flex align-items-center justify-content-center text-muted opacity-50">
                      <p>لا توجد رسائل بعد</p>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </AnimatePresence>
              </div>

              <div className="p-3 bg-white border-top shadow-sm z-3">
                <form onSubmit={formik.handleSubmit} className="d-flex align-items-center gap-2">
                  <label className="btn btn-light rounded-circle shadow-sm m-0 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <i className={`fa-solid ${selectedFile ? "fa-check text-success" : "fa-paperclip text-muted"}`}></i>
                    <input type="file" className="d-none" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} />
                  </label>
                  <input
                    type="text"
                    name="msg"
                    className="form-control rounded-pill border-0 bg-light px-4 shadow-none py-2"
                    placeholder="اكتب رسالة للمجموعة..."
                    value={formik.values.msg}
                    onChange={formik.handleChange}
                    autoComplete="off"
                  />
                  <button type="submit" className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} disabled={isUploading}>
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center text-muted">
               <h5>برجاء اختيار مجموعة للبدء</h5>
            </div>
          )}
        </div>
      </div>
    </div>}
  </>);
}
