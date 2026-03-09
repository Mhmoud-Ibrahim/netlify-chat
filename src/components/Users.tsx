import { useContext } from 'react';

import { SocketContext } from './SocketContext';
import ChatLoader from './ChatLoader';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';


function Users() {
      const navigate = useNavigate();
  const location = useLocation();
  const socketContext = useContext(SocketContext);


    if (socketContext?.loading) {
        return <ChatLoader />;
    }
    if (!socketContext) return null;
    const { onlineUsers, allUsers, setSelectedUser, userId, selectedUser } = socketContext;

  const currentUserId = String(userId || "").replace(/['"]+/g, '');

  const sortedUsers = allUsers
    ?.filter(u => String(u._id).replace(/['"]+/g, '') !== currentUserId)
    ?.map(user => {
      const isOnline = onlineUsers?.some(online =>
        String(online.userId).replace(/['"]+/g, '') === String(user._id ).replace(/['"]+/g, '')
      );
      return { ...user, isOnline };
    })
    .sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));

  const handleUserSelect = (id: string) => {
    const cleanId = String(id).replace(/['"]+/g, '');
    setSelectedUser(cleanId);
    if (location.pathname === "/users") {
      navigate("/home");
    }
  };

    return <>
        <Helmet>
            <title>Users </title>
            <meta name="description" content="Users " />
        </Helmet>
        <div className="container-fluid min-vh-100 bg-light py-5" style={{ marginTop: '60px' }}>
            <div className="container">
                {/* هيدر الصفحة بتصميم عصري */}
                <div className="row mb-5 animate__animated animate__fadeInDown">
                    <div className="col-12 text-center">
                        <div className="display-5 fw-bold text-success text-uppercase mb-2">

                            Chat Now
                        </div>
                        <p className="text-muted fs-5 fw-medium">
                            <i className="fa-solid fa-users-viewfinder me-2"></i>
                            Welcome to the Chat Now, where you can connect with people from around the world.
                        </p>
                        <div className="mx-auto bg-success  rounded-pill" style={{ width: '80px', height: '5px' }}></div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-11">
                        <div className="custom-users-page animate__animated animate__fadeInUp">
                           <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
      <div className="p-3 bg-white border-bottom d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fw-bold text-dark d-flex align-items-center">
          <span className="pulse-green me-2"></span>
          المستخدمين ({sortedUsers?.length || 0})
        </h6>
        <i className="fa-solid fa-users text-muted opacity-50"></i>
      </div>

      <div className="list-group list-group-flush custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        {sortedUsers?.map((u) => {
          const userIdStr = String(u._id || u._id).replace(/['"]+/g, '');
          const isSelected = String(selectedUser || "").replace(/['"]+/g, '') === userIdStr;

          return (
            <button
              key={userIdStr}
              onClick={() => handleUserSelect(userIdStr)}
              className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-3 px-3 transition-all ${isSelected ? 'bg-primary-subtle border-start border-primary border-4 shadow-sm' : ''
                }`}
            >
              <div className="position-relative me-3">
                <div className="rounded-circle overflow-hidden border border-2 border-warning shadow-sm" style={{ width: '38px', height: '38px' }}>
                  {u.fulluserImage || u.userImage ? (
                    <img
                      src={u.fulluserImage || u.userImage}
                      alt={u.name}
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

                {/* نقطة الحالة ديناميكية */}
                <span className={`position-absolute bottom-0 end-0 p-1 border border-white rounded-circle ${u.isOnline ? 'bg-success' : 'bg-secondary'}`}></span>
              </div>

              <div className="flex-grow-1 text-start">
                <div className={`mb-0 text-truncate ${isSelected ? 'fw-bold text-primary' : 'fw-bold text-dark'}`} style={{ maxWidth: '150px' }}>
                  {u.name?.split(' ').slice(0, 2).join(" ")}
                </div>
                <small className={`${u.isOnline ? 'text-success' : 'text-muted'} d-block`} style={{ fontSize: '11px' }}>
                  {u.isOnline ? "متصل الآن" : "غير متصل"}
                </small>
              </div>

              {isSelected && (
                <i className="fa-solid fa-comment text-primary fa-xs animate__animated animate__fadeInRight"></i>
              )}
            </button>
          );
        })}

        {sortedUsers?.length === 0 && (
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
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                /* تخصيص شكل القائمة لتظهر كـ Cards في صفحة المستخدمين */
                .custom-users-page .card {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                }

                .custom-users-page .list-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    background: transparent !important;
                    max-height: none !important; /* إلغاء التمرير الداخلي في هذه الصفحة */
                    overflow: visible !important;
                }

                .custom-users-page .list-group-item {
                    background: white !important;
                    border: 1px solid #f0f0f0 !important;
                    border-radius: 20px !important;
                    padding: 1.25rem !important;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    align-items: center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.04) !important;
                    margin-bottom: 0 !important;
                }

                .custom-users-page .list-group-item:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 15px 30px rgba(13, 110, 253, 0.1) !important;
                    border-color: #0d6efd !important;
                    z-index: 2;
                }

                /* إخفاء الهيدر الداخلي للـ UsersList لأنه مكرر هنا */
                .custom-users-page .card-header, 
                .custom-users-page h6.p-3 {
                    display: none !important;
                }

                /* تحسين شكل الصورة في الكارت */
                .custom-users-page .rounded-circle {
                    width: 55px !important;
                    height: 55px !important;
                    background: #f8f9fa;
                    border: 2px solid #fff;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                .animate__animated {
                    --animate-duration: 0.8s;
                }

                @media (max-width: 768px) {
                    .custom-users-page .list-group {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    </>
}

export default Users;
