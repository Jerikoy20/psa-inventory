import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, Plus, MoreHorizontal, Edit, UserCog, UserX, X, Save, AlertTriangle } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Users");
  
  // MENU STATE
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const actionMenuRef = useRef(null);

  // MODAL STATES
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // EDIT FORM STATE
  const [editForm, setEditForm] = useState({
    name: "", email: "", role: "", department: "", position: ""
  });

  // --- 1. FETCH DATA ---
  const fetchUsers = () => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false); })
      .catch(err => { console.error("Error:", err); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- 2. CLICK OUTSIDE TO CLOSE MENU ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 3. HANDLERS ---
  const toggleActionMenu = (id) => setOpenActionMenuId(openActionMenuId === id ? null : id);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({ 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      department: user.department || "", 
      position: user.position || "" 
    });
    setOpenActionMenuId(null);
    setShowEditModal(true);
  };

  const handleChangeOwnerClick = (user) => {
    setSelectedUser(user);
    setOpenActionMenuId(null);
    setShowOwnerModal(true);
  };

  const handleRemoveClick = async (userId) => {
    setOpenActionMenuId(null);
    if (confirm("Are you sure you want to remove this user?")) {
      try {
        await fetch(`http://localhost:5000/api/users/${userId}`, { method: 'DELETE' });
        fetchUsers();
      } catch (err) { alert("Failed to remove user."); }
    }
  };

  const saveUserChanges = async (e) => {
    e.preventDefault();
    const updatedUsers = users.map(u => u.id === selectedUser.id ? { ...u, ...editForm } : u);
    setUsers(updatedUsers);
    setShowEditModal(false);
    alert("✅ User details updated!");
  };

  const confirmChangeOwner = () => {
    const updatedUsers = users.map(u => {
      if (u.role === 'admin') return { ...u, role: 'user' }; 
      if (u.id === selectedUser.id) return { ...u, role: 'admin' }; 
      return u;
    });
    setUsers(updatedUsers);
    setShowOwnerModal(false);
    alert(`👑 Ownership transferred to ${selectedUser.name}.`);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Users...</div>;

  return (
    <div className="p-8 min-h-screen bg-gray-50/50 font-sans text-left relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the app's users and their roles</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"><Filter className="h-5 w-5" /></button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-all">
             <Plus className="h-4 w-4" /> Invite User
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab("Users")} className={`pb-3 text-sm font-bold transition-all relative ${activeTab === "Users" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>Users {activeTab === "Users" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full" />}</button>
        <button onClick={() => setActiveTab("Pending")} className={`pb-3 text-sm font-bold transition-all relative ${activeTab === "Pending" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>Pending requests {activeTab === "Pending" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full" />}</button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-visible" style={{ minHeight: '400px' }}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2"><h3 className="font-bold text-lg text-gray-900">Users</h3><span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">{filteredUsers.length}</span></div>
          <div className="flex gap-3 w-full md:w-auto"><div className="relative flex-1 md:w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" placeholder="Search by Email or Name" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
        </div>

        <div className="overflow-x-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Employee ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Contact No.</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Position</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filteredUsers.map((user, index) => {
                const isLastRow = index >= filteredUsers.length - 2; 
                return (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 text-gray-500 font-medium">{user.employee_id}</td>
                    <td className="px-6 py-4">
                      <div><span className="font-bold text-gray-900 block">{user.name}</span>{user.role === 'admin' && <span className="text-[11px] text-gray-400 font-medium">Owner</span>}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.contact_number}</td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>{user.role}</span></td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 text-gray-500">{user.department}</td>
                    <td className="px-6 py-4 text-gray-500">{user.position}</td>
                    
                    <td className="px-6 py-4 text-right relative">
                      <button onClick={(e) => { e.stopPropagation(); toggleActionMenu(user.id); }} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      
                      {openActionMenuId === user.id && (
                        <div 
                          ref={actionMenuRef} 
                          className={`absolute right-8 w-48 bg-white rounded-lg shadow-[0_4px_20px_-5px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${isLastRow ? 'bottom-0 origin-bottom-right' : 'top-0 origin-top-right'}`}
                        >
                          <div className="py-1">
                            <button onClick={() => handleEditClick(user)} className="flex items-center w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 font-medium">
                              <Edit className="h-4 w-4 mr-3 text-gray-400" /> Edit user
                            </button>

                            {/* --- LOGIC UPDATED: "Change owner" only appears if the row IS an Admin --- */}
                            {user.role === 'admin' && (
                              <button onClick={() => handleChangeOwnerClick(user)} className="flex items-center w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 font-medium">
                                <UserCog className="h-4 w-4 mr-3 text-gray-400" /> Change owner
                              </button>
                            )}

                            <div className="h-px bg-gray-100 my-1 mx-2"></div>

                            <button onClick={() => handleRemoveClick(user.id)} className="flex items-center w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium">
                              <UserX className="h-4 w-4 mr-3" /> Remove user
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
              <button onClick={() => setShowEditModal(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <form onSubmit={saveUserChanges} className="p-6 space-y-4">
              <div><label className="text-xs font-bold text-gray-500 uppercase">Full Name</label><input type="text" className="w-full mt-1 px-4 py-2 border rounded-xl" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase">Email</label><input type="email" className="w-full mt-1 px-4 py-2 border rounded-xl" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase">Department</label><input type="text" className="w-full mt-1 px-4 py-2 border rounded-xl" value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} /></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase">Position</label><input type="text" className="w-full mt-1 px-4 py-2 border rounded-xl" value={editForm.position} onChange={e => setEditForm({...editForm, position: e.target.value})} /></div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex justify-center items-center gap-2"><Save className="h-4 w-4" /> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE OWNER MODAL */}
      {showOwnerModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="bg-orange-50 p-6 text-center border-b border-orange-100">
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-600"><UserCog className="h-6 w-6" /></div>
              <h3 className="text-lg font-bold text-gray-900">Transfer Ownership?</h3>
              <p className="text-sm text-gray-500 mt-1">Make <strong>{selectedUser.name}</strong> the new Owner?</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs text-gray-500 mb-6 flex gap-2"><AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" /> You will lose Owner status and become a standard User.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowOwnerModal(false)} className="flex-1 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                <button onClick={confirmChangeOwner} className="flex-1 py-2 bg-gray-900 text-white font-bold rounded-xl">Confirm Transfer</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}