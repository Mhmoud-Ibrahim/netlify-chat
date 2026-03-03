

// import { useContext, useEffect, useState, useRef } from "react";
// import { SocketContext } from "./SocketContext";
// import api from "./api";
// import toast from "react-hot-toast";

// export function Profile() {
//   const socketContext = useContext(SocketContext);
//   if (!socketContext) return null;

//   const { user, setUser, updateUserData, socket, userId,setUserId } = socketContext;

//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleUpdateField = (field: "name" | "email") => {
//     const label = field === "name" ? "new name" : "new email";
//     const newValue = prompt(`Enter ${label}:`, user?.[field]);
    
//     if (newValue && newValue !== user?.[field]) {
//       setLoading(true);
//       socket?.emit("update_profile", { [field]: newValue });
//     }
//   };

//   useEffect(() => {
//     if (!socket) return;

//     const handleProfileUpdate = (updatedData: any) => {
//       const data = updatedData.user || updatedData;
//       setUser(updatedData.user ||data); // تحديث الكونتكس كاملاً
//       //console.log( updatedData.user.id);
//       setUserId(updatedData.user.id);
//       setLoading(false);
//     };

//     socket.on("profile_updated", handleProfileUpdate);
//     return () => { socket.off("profile_updated", handleProfileUpdate); };
//   }, [socket, setUser]);

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       setLoading(true);
//       const res = await api.post("/profileImage", formData);
// // console.log(res.data.user);
//       if (res.data && res.data.user) {
//         setUser(res.data.user);
//         updateUserData(res.data.user);
//          toast.success(`تم رفع الصورة بنجاح`, {
//                         icon: '💬',
//                         duration: 3000,
//                         position: 'top-right',
//                         style: {
//                             borderRadius: '10px',
//                             background: '#123405',
//                             color: 'yellow',
//                         },
//                     });
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//         toast.error(`حدث خطأ أثناء رفع الصورة`, {
//                         icon: '💬',
//                         duration: 4000,
//                         position: 'top-right',
//                         style: {
//                             borderRadius: '10px',
//                             background: '#123405',
//                             color: 'yellow',
//                         },
//                     });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return (
//     <div className="d-flex flex-column align-items-center justify-content-center vh-100">
//       <div className="spinner-border text-primary" role="status"></div>
//       <p className="mt-3 fw-bold">جاري تحديث بياناتك...</p>
//     </div>
//   );

//   return (
//     <div className="container py-5 mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6 col-lg-5">
//           <div className="card shadow border-0 rounded-4 overflow-hidden">
//             {/* Header / Cover */}
//             <div className="card-header bg-primary py-5 text-center position-relative mb-5">
//               <div className="position-absolute top-100 start-50 translate-middle">
//                 <div className="rounded-circle bg-white p-1 shadow-sm position-relative">
//                   <div className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-inner" 
//                        style={{ width: "120px", height: "120px", overflow: "hidden" }}>
//                    {user?.fulluserImage ? (
//                       <img src={user.fulluserImage} className="w-100 h-100 object-fit-cover" alt="Profile" />
//                     ) : (
//                       <i className="fa-solid fa-user fa-4x text-secondary mt-3"></i>
//                     )}
//                   </div>
//                   <button 
//                     className="btn btn-warning btn-sm rounded-circle position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center shadow"
//                     style={{ width: "35px", height: "35px", border: "3px solid white" }}
//                     onClick={() => fileInputRef.current?.click()}
//                   >
//                     <i className="fa-solid fa-camera text-dark"></i>
//                   </button>
//                   <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
//                 </div>
//               </div>
//             </div>

//             {/* Body */}
//             <div className="card-body text-center mt-4">
//               <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
//                 <h3 className="fw-bold m-0">{user?.name || "مستخدم"}</h3>
//                 <button className="btn btn-outline-secondary btn-sm border-0 rounded-circle" onClick={() => handleUpdateField("name")}>
//                   <i className="fa-solid fa-pen-to-square"></i>
//                 </button>
//               </div>
//               <p className="badge bg-light text-secondary rounded-pill px-3 py-2">ID: {userId}</p>
              
//               <div className="mt-4 text-start px-4">
//                 <div className="mb-4 p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
//                   <div>
//                     <label className="text-muted small d-block fw-bold">Email Address</label>
//                     <span className="text-dark">{user?.email || "لا يوجد بريد"}</span>
//                   </div>
//                   <button className="btn btn-sm btn-link text-primary p-0" onClick={() => handleUpdateField("email")}>تعديل</button>
//                 </div>

//                 <div className="p-3 bg-light rounded-3">
//                   <label className="text-muted small d-block fw-bold">Member Since</label>
//                   <span className="text-dark">
//                     {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : "غير محدد"}
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="card-footer bg-white border-0 pb-4 text-center">
//                <small className="text-muted">يمكنك تعديل بياناتك الشخصية في أي وقت</small>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useContext, useEffect, useState, useRef } from "react";
import { SocketContext } from "./SocketContext";
import api from "./api";
import toast from "react-hot-toast";

export function Profile() {
  const socketContext = useContext(SocketContext);
  if (!socketContext) return null;

  const { user, setUser, updateUserData, socket, userId, setUserId } = socketContext;

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- دالة التعديل باستخدام React Hot Toast ---
  const handleUpdateField = (field: "name" | "email") => {
    const label = field === "name" ? "الاسم الجديد" : "البريد الإلكتروني الجديد";
    const defaultValue = user?.[field] || "";

    toast((t) => (
      <div className="flex flex-col gap-3" style={{ minWidth: '250px', direction: 'rtl' }}>
        <p className="fw-bold mb-2 text-dark">تعديل {field === "name" ? "الاسم" : "البريد"}</p>
        <input
          type={field === "email" ? "email" : "text"}
          defaultValue={defaultValue}
          id="toast-input"
          className="form-control form-control-sm mb-3"
          placeholder={label}
          autoFocus
        />
        <div className="d-flex justify-content-end gap-2">
          <button 
            className="btn btn-sm btn-light" 
            onClick={() => toast.dismiss(t.id)}
          >
            إلغاء
          </button>
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => {
              const newValue = (document.getElementById('toast-input') as HTMLInputElement).value;
              if (newValue && newValue !== defaultValue) {
                setLoading(true);
                socket?.emit("update_profile", { [field]: newValue });
                toast.dismiss(t.id);
                toast.loading("جاري التحديث...", { id: "updating" });
              } else {
                toast.error("لم يتم تغيير القيمة");
              }
            }}
          >
            حفظ
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: { borderRadius: '15px', padding: '16px' }
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleProfileUpdate = (updatedData: any) => {
      const data = updatedData.user || updatedData;
      setUser(data); 
      setUserId(data.id || data._id);
      setLoading(false);
      toast.dismiss("updating"); // إغلاق رسالة التحميل
      toast.success("تم تحديث البيانات بنجاح ✅");
    };

    socket.on("profile_updated", handleProfileUpdate);
    return () => { socket.off("profile_updated", handleProfileUpdate); };
  }, [socket, setUser, setUserId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await api.post("/profileImage", formData);
      if (res.data && res.data.user) {
        setUser(res.data.user);
        updateUserData(res.data.user);
        toast.success(`تم رفع الصورة بنجاح`, {
          icon: '📸',
          duration: 3000,
          style: { borderRadius: '10px', background: '#123405', color: '#fff' },
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(`حدث خطأ أثناء رفع الصورة`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 fw-bold">جاري المعالجة...</p>
    </div>
  );

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-primary py-5 text-center position-relative mb-5">
              <div className="position-absolute top-100 start-50 translate-middle">
                <div className="rounded-circle bg-white p-1 shadow-sm position-relative">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-inner" 
                       style={{ width: "120px", height: "120px", overflow: "hidden" }}>
                   {user?.fulluserImage ? (
                      <img src={user.fulluserImage} className="w-100 h-100 object-fit-cover" alt="Profile" />
                    ) : (
                      <i className="fa-solid fa-user fa-4x text-secondary mt-3"></i>
                    )}
                  </div>
                  <button 
                    className="btn btn-warning btn-sm rounded-circle position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center shadow"
                    style={{ width: "35px", height: "35px", border: "3px solid white" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="fa-solid fa-camera text-dark"></i>
                  </button>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                </div>
              </div>
            </div>

            <div className="card-body text-center mt-4">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <h3 className="fw-bold m-0">{user?.name || "مستخدم"}</h3>
                <button className="btn btn-outline-secondary btn-sm border-0 rounded-circle" onClick={() => handleUpdateField("name")}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              </div>
              <p className="badge bg-light text-secondary rounded-pill px-3 py-2">ID: {userId}</p>
              
              <div className="mt-4 text-start px-4">
                <div className="mb-4 p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <div>
                    <label className="text-muted small d-block fw-bold italic">Email Address</label>
                    <span className="text-dark">{user?.email || "لا يوجد بريد"}</span>
                  </div>
                  <button className="btn btn-sm btn-link text-primary p-0 text-decoration-none fw-bold" onClick={() => handleUpdateField("email")}>تعديل</button>
                </div>

                <div className="p-3 bg-light rounded-3">
                  <label className="text-muted small d-block fw-bold">Member Since</label>
                  <span className="text-dark">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : "غير محدد"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="card-footer bg-white border-0 pb-4 text-center">
               <small className="text-muted">يمكنك تعديل بياناتك الشخصية في أي وقت</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

