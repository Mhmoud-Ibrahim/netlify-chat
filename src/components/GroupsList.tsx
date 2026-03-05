import { useContext, useState } from "react";
import { SocketContext } from "./SocketContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "./api"; // تأكد من استيراد مكتبة الـ api الخاصة بك
import toast from "react-hot-toast";

export function GroupsList() {
  const context = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();

  // حالات محلية لإنشاء مجموعة جديدة
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  if (!context) return null;

  const { userGroups, selectedGroup, setSelectedGroup, allUsers, userId, loading } = context;

  const currentUserId = String(userId || "").replace(/['"]+/g, '');

  const handleGroupSelect = (id: string) => {
    setSelectedGroup(id);
    if (location.pathname === "/groups" || location.pathname === "/users") {
      navigate("/home");
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedMembers.length === 0) {
      return toast.error("يرجى إدخال اسم المجموعة واختيار أعضاء");
    }
    try {
      await api.post("/auth/groups", { name: groupName, members: selectedMembers });
      toast.success("تم إنشاء المجموعة بنجاح");
      setShowCreateModal(false);
      setGroupName("");
      setSelectedMembers([]);
      window.location.reload(); // لتحديث القائمة فوراً
    } catch (err) {
      toast.error("فشل إنشاء المجموعة");
    }
  };

  const toggleMember = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
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
      <title>Groups List</title>
    </Helmet>

    <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
      {/* الرأس مع زر الإضافة */}
      <div className="p-3 bg-white border-bottom d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fw-bold text-dark d-flex align-items-center">
          <i className="fa-solid fa-layer-group me-2 text-primary"></i>
          المجموعات ({userGroups?.length || 0})
        </h6>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn btn-sm btn-primary rounded-circle shadow-sm"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {/* قائمة المجموعات */}
      <div className="list-group list-group-flush custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        {userGroups?.map((group) => {
          const isSelected = selectedGroup === group._id;
          return (
            <button
              key={group._id}
              onClick={() => handleGroupSelect(group._id)}
              className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-3 px-3 transition-all ${isSelected ? 'bg-primary-subtle border-start border-primary border-4' : ''}`}
            >
              <div className="position-relative me-3">
                <div className="rounded-circle overflow-hidden border border-2 border-primary shadow-sm bg-light d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                  {group.groupImage ? (
                    <img src={group.groupImage} className="w-100 h-100 object-fit-cover" alt={group.name} />
                  ) : (
                    <i className="fa-solid fa-users text-primary"></i>
                  )}
                </div>
              </div>

              <div className="flex-grow-1 text-start">
                <div className={`mb-0 text-truncate ${isSelected ? 'fw-bold text-primary' : 'fw-bold text-dark'}`}>
                  {group.name}
                </div>
                <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                  {group.members?.length} عضو في المجموعة
                </small>
              </div>
            </button>
          );
        })}

        {userGroups?.length === 0 && (
          <div className="p-5 text-center text-muted">
            <p className="small">لا توجد مجموعات حالياً</p>
          </div>
        )}
      </div>
    </div>

    {/* نافذة إنشاء مجموعة جديدة (Modal مبسط) */}
    {showCreateModal && (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">إنشاء مجموعة جديدة</h5>
              <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
            </div>
            <div className="modal-body">
              <input 
                type="text" 
                className="form-control mb-3 rounded-3" 
                placeholder="اسم المجموعة..." 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <p className="small fw-bold mb-2">اختر الأعضاء:</p>
              <div className="list-group custom-scrollbar" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {allUsers?.filter(u => String(u._id) !== currentUserId).map(u => (
                  <label key={u._id} className="list-group-item d-flex align-items-center border-0 py-2">
                    <input 
                      type="checkbox" 
                      className="form-check-input me-3" 
                      onChange={() => toggleMember(u._id)}
                      checked={selectedMembers.includes(u._id)}
                    />
                    <span className="small">{u.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-light rounded-pill px-4" onClick={() => setShowCreateModal(false)}>إلغاء</button>
              <button className="btn btn-primary rounded-pill px-4" onClick={handleCreateGroup}>إنشاء</button>
            </div>
          </div>
        </div>
      </div>
    )}

    <style>{`
      .transition-all { transition: all 0.2s ease-in-out; }
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
    `}</style>
  </>
}
