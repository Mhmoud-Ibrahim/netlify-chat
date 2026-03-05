import { useContext, useState } from "react";
import { SocketContext } from "./SocketContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "./api"; 
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"; 

export function GroupsList() {
  const context = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  if (!context) return null;

  const { userGroups, selectedGroup, setSelectedGroup, allUsers, userId, loading, setSelectedUser } = context;
  const currentUserId = String(userId || "").replace(/['"]+/g, '');

  const handleGroupSelect = (id: string) => {
    const cleanId = String(id).replace(/['"]+/g, '');
    setSelectedUser(null); 
    setSelectedGroup(cleanId);
    if (location.pathname !== "/groupChat") {
      navigate("/groupChat");
    }
  };
 
  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      return toast.error("يرجى إدخال اسم المجموعة واختيار عضو واحد على الأقل");
    }
    try {
      const res = await api.post("/auth/groups", { name: groupName, members: selectedMembers });
      
      if (res.data.group) {
        // console.log(res.data.group);
        const newGroup = res.data.group;
        toast.success("تم إنشاء المجموعة بنجاح");
          if (context.fetchGroups) {
            await context.fetchGroups(); 
        }
        setShowCreateModal(false);
        setGroupName("");
        setSelectedMembers([]);
        setSelectedUser(null); 
        setSelectedGroup(newGroup._id);
        navigate("/groupChat"); 


      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "فشل إنشاء المجموعة");
    }
  };
  const toggleMember = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return <>
    <Helmet><title>Groups List</title></Helmet>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card shadow-sm border-0 rounded-4 mt-5 overflow-hidden h-100"
    >
      <div className="p-3 bg-white border-bottom d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fw-bold text-dark d-flex align-items-center">
          <i className="fa-solid fa-layer-group me-2 text-primary"></i>
          المجموعات ({userGroups?.length || 0})
        </h6>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreateModal(true)} 
          className="btn btn-sm btn-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center"
          style={{ width: '32px', height: '32px' }}
        >
          <i className="fa-solid fa-plus"></i>
        </motion.button>
      </div>

      <div className="list-group list-group-flush custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        <AnimatePresence>
          {userGroups?.map((group, index) => (
            <motion.button
              key={group._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleGroupSelect(group._id)}
              className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-3 px-3 transition-all ${selectedGroup === group._id ? 'bg-primary-subtle border-start border-primary border-4 shadow-sm' : ''}`}
            >
              <div className="position-relative me-3">
                <div className="rounded-circle overflow-hidden border border-2 border-primary d-flex align-items-center justify-content-center bg-light shadow-sm" style={{ width: '42px', height: '42px' }}>
                  {group.groupImage ? (
                    <img src={group.groupImage} className="w-100 h-100 object-fit-cover" alt={group.name} />
                  ) : (
                    <i className="fa-solid fa-users text-primary"></i>
                  )}
                </div>
              </div>
              <div className="flex-grow-1 text-start">
                <div className={`mb-0 text-truncate ${selectedGroup === group._id ? 'fw-bold text-primary' : 'fw-bold text-dark'}`} style={{ maxWidth: '150px' }}>
                  {group.name}
                </div>
                <small className="text-muted" style={{ fontSize: '10px' }}>{group.members?.length} أعضاء</small>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>

    <AnimatePresence>
      {showCreateModal && (
        <div className="modal d-block" style={{ zIndex: 1060 }}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop show" 
            onClick={() => setShowCreateModal(false)}
          />
          <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 1061 }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="modal-content border-0 rounded-4 shadow-lg"
            >
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold m-0">إنشاء مجموعة جديدة</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="small fw-bold text-muted mb-1">اسم المجموعة</label>
                  <input 
                    type="text" 
                    className="form-control rounded-3 border-light bg-light" 
                    placeholder="مثال: دردشة الأصدقاء"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
                <p className="small fw-bold mb-2">اختر الأعضاء ({selectedMembers.length}):</p>
                <div className="list-group overflow-auto custom-scrollbar" style={{ maxHeight: '200px' }}>
                  {allUsers?.filter(u => String(u._id) !== currentUserId).map(u => (
                    <motion.label 
                      whileHover={{ x: 5 }}
                      key={u._id} 
                      className="list-group-item d-flex align-items-center border-0 cursor-pointer py-2 rounded-3 mb-1"
                    >
                      <input 
                        type="checkbox" 
                        className="form-check-input me-3" 
                        checked={selectedMembers.includes(u._id)}
                        onChange={() => toggleMember(u._id)}
                      />
                      <span className="small text-dark">{u.name}</span>
                    </motion.label>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-light rounded-pill px-4" onClick={() => setShowCreateModal(false)}>إلغاء</button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary rounded-pill px-4 shadow-sm" 
                  onClick={handleCreateGroup}
                >
                  تأكيد الإنشاء
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>

    <style>{`
      .cursor-pointer { cursor: pointer; }
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
    `}</style>
  </>
}
