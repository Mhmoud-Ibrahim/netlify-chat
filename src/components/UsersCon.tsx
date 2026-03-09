import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "./SocketContext.tsx";
import ChatLoader from "./ChatLoader.tsx";

function UsersCon() {
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
        ?.filter(u => String(u._id||u.id).replace(/['"]+/g, '') !== currentUserId)
        ?.map(user => {
            const isOnline = onlineUsers?.some(online =>
                String(online.userId).replace(/['"]+/g, '') === String(user._id).replace(/['"]+/g, '')
            );
            return { ...user, isOnline };
        })
        //.sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));

    const handleUserSelect = (_id: string) => {
        const cleanId = String(_id).replace(/['"]+/g, '');
        setSelectedUser(cleanId);
        if (location.pathname === "/users") {
            navigate("/home");
        }
    };
  return (
    <div>
      <div className="list-group list-group-flush custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    {sortedUsers?.map((u) => {
                                        const userIdStr = String(u._id || u.id).replace(/['"]+/g, '');
                                        const isSelected = String(selectedUser || "").replace(/['"]+/g, '') === userIdStr;
                                            console.log(u);
                                        return (
                                            <button
                                                key={userIdStr}
                                                onClick={() => handleUserSelect(userIdStr)}
                                                className={` border-0 d-flex align-items-center py-3 px-3 transition-all ${isSelected ? 'bg-primary-subtle border-start border-primary border-4 shadow-sm' : ''
                                                    }`}
                                            >
                                                <div className=" me-3">
                                                    <div className="rounded-circle  border border-3 border-warning shadow-sm" >
                                                        
                                                        {u.fulluserImage || u.userImage ||u.fullImageUrl? (

                                                                <img
                                                                src={u.fulluserImage || u.userImage || u.fullImageUrl}
                                                                alt={u.name}
                                                                className={`" object-fit-cover border border-3 rounded-circle "${u.isOnline ? 'border-success' :'border-secondary'}`}
                                                               style={{ width: '45px', height: '45px'}}
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


                                                    {/* نقطة الحالة ديناميكية
                                                   // <span className={`position-absolute bottom-0 end-0 p-1 border border-white rounded-circle ${u.isOnline ? 'bg-success' : 'bg-secondary'}`}></span>
                                                */}
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
    </div>
  )
}

export default UsersCon
