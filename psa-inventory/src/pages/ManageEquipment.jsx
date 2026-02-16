import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";

export default function ManageEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    pn: "",
    sn: "",
    type: "Laptop",
    status: "Available",
    condition: "Excellent"
  });

  // 1. FETCH EQUIPMENT
  const fetchEquipment = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/equipment')
      .then(res => res.json())
      .then(data => {
        setEquipment(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch equipment", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // 2. HANDLE ADD / EDIT SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = modalMode === "edit" 
      ? `http://localhost:5000/api/equipment/${formData.id}` 
      : `http://localhost:5000/api/equipment`;
    const method = modalMode === "edit" ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert(`✅ Equipment ${modalMode === 'edit' ? 'updated' : 'added'} successfully!`);
        setShowModal(false);
        fetchEquipment();
      } else {
        alert("❌ Failed to save equipment.");
      }
    } catch (error) {
      alert("❌ Server error.");
    }
  };

  // 3. HANDLE DELETE
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/equipment/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        fetchEquipment();
      } else {
        alert("❌ Failed to delete equipment.");
      }
    } catch (error) {
      alert("❌ Server error.");
    }
  };

  // Opens modal for adding
  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData({ name: "", desc: "", pn: "", sn: "", type: "Laptop", status: "Available", condition: "Excellent" });
    setShowModal(true);
  };

  // Opens modal for editing
  const handleOpenEdit = (item) => {
    setModalMode("edit");
    setFormData(item);
    setShowModal(true);
  };

  // Filter based on Search Term
  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.pn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sn && item.sn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50/50 font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Equipment</h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, and manage equipment inventory</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" /> Add Equipment
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search equipment..." 
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-gray-100 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Property No.</th>
                <th className="px-6 py-4 font-medium">Serial No.</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Condition</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading inventory...</td></tr>
              ) : filteredEquipment.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">No equipment found.</td></tr>
              ) : (
                filteredEquipment.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600">{item.type}</td>
                    <td className="px-6 py-4 text-gray-600">{item.pn}</td>
                    <td className="px-6 py-4 text-gray-600">{item.sn || "-"}</td>
                    <td className="px-6 py-4">
                      {/* STATUS BADGE MATCHING YOUR SCREENSHOT EXACTLY */}
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                        item.status === "Available" ? "bg-green-50 text-green-500 border-green-200" :
                        item.status === "Borrowed" ? "bg-blue-50 text-blue-500 border-blue-200" :
                        "bg-orange-50 text-orange-500 border-orange-200"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.condition}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === "add" ? "Add New Equipment" : "Edit Equipment"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">Name</label>
                <input 
                  type="text" required placeholder="e.g. Dell Latitude 5520"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">Description</label>
                <input 
                  type="text" required placeholder="Detailed specs..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-900">Property No.</label>
                  <input 
                    type="text" required placeholder="PSA-LAP-2024-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.pn} onChange={(e) => setFormData({...formData, pn: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-900">Serial No.</label>
                  <input 
                    type="text" required placeholder="S/N"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.sn} onChange={(e) => setFormData({...formData, sn: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-900">Type</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Laptop</option><option>Printer</option><option>Access Point</option>
                    <option>Speaker</option><option>Tablet</option><option>Switch</option><option>Router</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-900">Condition</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})}
                  >
                    <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-900">Status</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option>Available</option><option>Borrowed</option><option>Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  {modalMode === "add" ? "Save Equipment" : "Update Equipment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}