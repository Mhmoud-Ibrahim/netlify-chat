// import { useContext, useEffect } from "react";
// import { SocketContext } from "./SocketContext";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { Helmet } from "react-helmet-async";

// export function UsersList() {
//   const context = useContext(SocketContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   if (!context) return null;

//   const { onlineUsers, setSelectedUser, userId, selectedUser, loading } = context;


//   // هذا السطر سيساعدك في معرفة المسمى الصحيح للصورة في الـ Console
//   useEffect(() => {
//     if (onlineUsers?.length > 0) {
//       // console.log("بيانات المستخدمين المتصلين:", selectedUser);
//       // console.log("userId:", userId);
//       // console.log("onlineUsers:", onlineUsers);
//     }
//   }, [onlineUsers,userId]);

//   const currentUserId = String(userId || "").replace(/['"]+/g, '');

//   const handleUserSelect = (id: string) => {
//     const cleanId = String(id).replace(/['"]+/g, '');
//     setSelectedUser(cleanId);
//     if (location.pathname === "/users") {
//       navigate("/home");
//     }
//   };

//   const filteredUsers = onlineUsers?.filter(u =>
//     String(u.userId).replace(/['"]+/g, '') !== currentUserId
//   );

//   if (loading) {
//     return (
//       <div className="p-5 text-center">
//         <div className="spinner-border spinner-border-sm text-primary"></div>
//       </div>
//     );
//   }
//   return <>
//   <Helmet>
//           <title>User List </title>
//           <meta name="description" content="User List " />
//         </Helmet>
//     <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
//       <div className="p-3 bg-white border-bottom d-flex align-items-center justify-content-between">
//         <h6 className="mb-0 fw-bold text-dark d-flex align-items-center">
//           <span className="pulse-green me-2"></span>
//           المتصلون الآن ({filteredUsers?.length || 0})
//         </h6>
//         <i className="fa-solid fa-users text-muted opacity-50"></i>
//       </div>

//       <div className="list-group list-group-flush custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
//         {filteredUsers?.map(u => {
//           const isSelected = String(selectedUser || "").replace(/['"]+/g, '') === String(u.userId).replace(/['"]+/g, '');

//           return (
//             <button
//               key={u.userId}
//               onClick={() => handleUserSelect(u.userId)}
//               className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-3 px-3 transition-all ${isSelected ? 'bg-primary-subtle border-start border-primary border-4 shadow-sm' : ''
//                 }`}
//             >
//               <div className="position-relative me-3">
//                 <div className="rounded-circle overflow-hidden border border-2 border-warning shadow-sm" style={{ width: '38px', height: '38px' }}>
            
//                   {u.fulluserImage || u.userImage ? (
//                     <img
//                       src={u.fulluserImage || u.userImage}
//                       alt={u.name}
//                       className="w-100 h-100 object-fit-cover"
//                       onError={(e) => {
//                         e.currentTarget.style.display = 'none';
//                         const parent = e.currentTarget.parentElement;
//                         if (parent) parent.innerHTML = '<div class="w-100 h-100 d-flex align-items-center justify-content-center"><i class="fa-solid fa-user text-secondary"></i></div>';
//                       }}
//                     />
//                   ) : (
//                     <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
//                       <i className="fa-solid fa-user text-secondary"></i>
//                     </div>
//                   )}
//                 </div>

//                 <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle"></span>
//               </div>

//               <div className="flex-grow-1 text-start">
//                 <div className={`mb-0 text-truncate ${isSelected ? 'fw-bold text-primary' : 'fw-bold text-dark'}`} style={{ maxWidth: '150px' }}>
//                   {u.name.split(' ').slice(0,2).join(" ")}
//                 </div>
//                 <small className="text-success d-block" style={{ fontSize: '11px' }}>
//                   متصل الآن
//                 </small>
//               </div>

//               {isSelected && (
//                 <i className="fa-solid fa-comment text-primary fa-xs animate__animated animate__fadeInRight"></i>
//               )}
//             </button>
//           );
//         })}

//         {filteredUsers?.length === 0 && (
//           <div className="p-5 text-center text-muted">
//             <div className="bg-light rounded-circle d-inline-flex p-3 mb-3">
//               <i className="fa-solid fa-user-group fa-2x opacity-25"></i>
//             </div>
//             <p className="small fw-medium">لا يوجد مستخدمون متصلون</p>
//             <Link to="/users" className="btn btn-sm btn-outline-primary rounded-pill px-3" >
//               تحديث القائمة
//             </Link>
//           </div>
//         )}
//       </div>

//       <style>{`
//         .pulse-green { width: 8px; height: 8px; background: #28a745; border-radius: 50%; animation: pulse 2s infinite; }
//         @keyframes pulse {
//           0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
//           70% { box-shadow: 0 0 0 8px rgba(40, 167, 69, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
//         }
//         .transition-all { transition: all 0.2s ease-in-out; }
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
//       `}</style>
//     </div>
//   </>
// }

import { useContext } from "react";
import { SocketContext } from "./SocketContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export function UsersList() {
  const context = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!context) return null;

  const { onlineUsers, allUsers, setSelectedUser, userId, selectedUser, loading } = context;

  const currentUserId = String(userId || "").replace(/['"]+/g, '');

  const filteredUsers = allUsers?.filter(u =>
    String(u._id).replace(/['"]+/g, '') !== currentUserId
  );

  const handleUserSelect = (id: string) => {
    const cleanId = String(id).replace(/['"]+/g, '');
    setSelectedUser(cleanId);
    if (location.pathname === "/users") {
      navigate("/home");
    }
  };

  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="spinner-border spinner-border-sm text-primary"></div>
      </div>
    );
  }

  return <>
    <Helmet>
      <title>User List </title>
      <meta name="description" content="User List " />
    </Helmet>
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
      <div className="p-3 bg-white border-bottom d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fw-bold text-dark d-flex align-items-center">
          <span className="pulse-green me-2"></span>
          المستخدمين ({filteredUsers?.length || 0})
        </h6>
        <i className="fa-solid fa-users text-muted opacity-50"></i>
      </div>

      <div className="list-group list-group-flush custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        {filteredUsers?.map((user) => {
          const userIdStr = String(user._id ).replace(/['"]+/g, '');
          const isSelected = selectedUser === userIdStr;
          
          // التحقق من حالة الاتصال
          const isOnline = onlineUsers?.some(online => 
            String(online.userId).replace(/['"]+/g, '') === userIdStr
          );

          return (
            <button
              key={userIdStr}
              onClick={() => handleUserSelect(userIdStr)}
              className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-3 px-3 transition-all ${isSelected ? 'bg-primary-subtle border-start border-primary border-4 shadow-sm' : ''
                }`}
            >
              <div className="position-relative me-3">
                <div className="rounded-circle overflow-hidden border border-2 border-warning shadow-sm" style={{ width: '38px', height: '38px' }}>
                  {user.fulluserImage || user.userImage ? (
                    <img
                      src={user.fulluserImage || user.userImage}
                      alt={user.name}
                      className="w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) parent.innerHTML = '<div class="w-100 h-100 d-flex align-items-center justify-content-center"><i class="fa-solid fa-user text-secondary"></i></div>';
                      }}
                    />
                  ) : (
                    <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                      <i className="fa-solid fa-user text-secondary"></i>
                    </div>
                  )}
                </div>

                {/* نقطة الحالة: أخضر للمتصل ورمادي لغير المتصل */}
                <span className={`position-absolute bottom-0 end-0 p-1 border border-white rounded-circle ${isOnline ? 'bg-success' : 'bg-secondary'}`}></span>
              </div>

              <div className="flex-grow-1 text-start">
                <div className={`mb-0 text-truncate ${isSelected ? 'fw-bold text-primary' : 'fw-bold text-dark'}`} style={{ maxWidth: '150px' }}>
                  {user.name?.split(' ').slice(0, 2).join(" ")}
                </div>
                <small className={`${isOnline ? 'text-success' : 'text-muted'} d-block`} style={{ fontSize: '11px' }}>
                  {isOnline ? "متصل الآن" : "غير متصل"}
                </small>
              </div>

              {isSelected && (
                <i className="fa-solid fa-comment text-primary fa-xs animate__animated animate__fadeInRight"></i>
              )}
            </button>
          );
        })}

        {filteredUsers?.length === 0 && (
          <div className="p-5 text-center text-muted">
            <div className="bg-light rounded-circle d-inline-flex p-3 mb-3">
              <i className="fa-solid fa-user-group fa-2x opacity-25"></i>
            </div>
            <p className="small fw-medium">لا يوجد مستخدمون</p>
            <Link to="/users" className="btn btn-sm btn-outline-primary rounded-pill px-3" >
              تحديث القائمة
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .pulse-green { width: 8px; height: 8px; background: #28a745; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(40, 167, 69, 0); }
          100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }
        .transition-all { transition: all 0.2s ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
      `}</style>
    </div>
  </>
}
