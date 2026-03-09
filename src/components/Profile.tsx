
import { useContext, useEffect, useState, useRef } from "react";
import { SocketContext } from "./SocketContext";
import api from "./api";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion"; // إضافة المكتبة

export function Profile() {
  const socketContext = useContext(SocketContext);
  if (!socketContext) return null;

  const { user, setUser, updateUserData, socket, userId, setUserId } = socketContext;

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
           save
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
      console.log(data);
      toast.dismiss("updating"); 
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
        console.log(res.data.user);
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

  return <>
    <Helmet>
      <title>Profile</title>
      <meta name="description" content="Your Profile" />
    </Helmet>
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card shadow border-0 rounded-4 overflow-hidden"
          >
            <div className="card-header bg-primary py-5 text-center position-relative mb-5">
              <div className="position-absolute top-100 start-50 translate-middle">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="rounded-circle bg-white p-1 shadow-sm position-relative"
                >
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-inner" 
                       style={{ width: "120px", height: "120px", overflow: "hidden" }}>
                    <AnimatePresence mode="wait">
                      {user?.fullUserImage ? (
                        <motion.img 
                          key={user.fullUserImage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          src={user.fullUserImage || user.userImage || "/default-avatar.png"  } 
                          className="w-100 h-100 object-fit-cover" 
                          alt="Profile" 
                        />
                      ) : (
                        <motion.i 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="fa-solid fa-user fa-4x text-secondary mt-3"
                        ></motion.i>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-warning btn-sm rounded-circle position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center shadow"
                    style={{ width: "35px", height: "35px", border: "3px solid white" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="fa-solid fa-camera text-dark"></i>
                  </motion.button>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                </motion.div>
              </div>
            </div>

            <div className="card-body text-center mt-4">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <h3 className="fw-bold m-0">{user?.name || "مستخدم"}</h3>
                <motion.button 
                  whileHover={{ rotate: 15 }}
                  className="btn btn-outline-secondary btn-sm border-0 rounded-circle" 
                  onClick={() => handleUpdateField("name")}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </motion.button>
              </div>
              <p className="badge bg-light text-secondary rounded-pill px-3 py-2">ID: {userId}</p>
              
              <div className="mt-4 text-start px-4">
                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4 p-3 bg-light rounded-3 d-flex justify-content-between align-items-center shadow-sm"
                >
                  <div>
                    <label className="text-muted small d-block fw-bold italic">Email Address</label>
                    <span className="text-dark">{user?.email || "لا يوجد بريد"}</span>
                  </div>
                  <button className="btn btn-sm btn-link text-primary p-0 text-decoration-none fw-bold" onClick={() => handleUpdateField("email")}>تعديل</button>
                </motion.div>

                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-3 bg-light rounded-3 shadow-sm"
                >
                  <label className="text-muted small d-block fw-bold">Member Since</label>
                  <span className="text-dark">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : "غير محدد"}
                  </span>
                </motion.div>
              </div>
            </div>
            
            <div className="card-footer bg-white border-0 pb-4 text-center">
               <small className="text-muted">يمكنك تعديل بياناتك الشخصية في أي وقت</small>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </>
}
