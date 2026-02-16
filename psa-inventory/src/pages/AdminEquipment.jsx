import React, { useState } from "react";
import { 
  Plus, Search, Filter, Smartphone, Speaker, Laptop, 
  Wifi, Monitor, Package, X, Edit, Trash2, Eye
} from "lucide-react";

export default function AdminEquipment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("All Status");
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- MOCK DATA ---
  const [equipmentList, setEquipmentList] = useState([
    { id: 1, name: "TECNO POVA 6PRO", model: "fsdfa", brand: "Mitsubishi", pn: "bzdvD243425", serial: "sFD64581", type: "Tablet", status: "Available", condition: "Good", location: "PSA" },
    { id: 2, name: "JBL PartyBox 310", model: "PartyBox 310", brand: "JBL", pn: "PSA-SPK-2024-001", serial: "JBL-888", type: "Speaker", status: "Borrowed", condition: "Good", location: "Conference Room" },
    { id: 3, name: "Dell Latitude 5520", model: "Latitude 5520", brand: "Dell", pn: "PSA-LAP-2024-001", serial: "DL-5520", type: "Laptop", status: "Under Maintenance", condition: "Excellent", location: "IT Dept" },
    { id: 4, name: "Cisco Catalyst 2960", model: "2960-X", brand: "Cisco", pn: "PSA-SW-2024-001", serial: "CS-2960", type: "Network", status: "Available", condition: "Good", location: "Server Room" },
  ]);

  // --- HELPERS ---
  const getStatusStyle = (status) => {
    switch(status) {
      case "Available": return "bg-green-100 text-green-700";
      case "Borrowed": return "bg-blue-100 text-blue-700";
      case "Under Maintenance": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getIcon = (type, size = "h-12 w-12") => {
    switch(type) {
      case "Phone": case "Tablet": return <Smartphone className={`${size} text-gray-400`} />;
      case "Speaker": return <Speaker className={`${size} text-gray-400`} />;
      case "Laptop": return <Laptop className={`${size} text-gray-400`} />;
      case "Network": return <Wifi className={`${size} text-gray-400`} />;
      case "Desktop": return <Monitor className={`${size} text-gray-400`} />;
      default: return <Package className={`${size} text-gray-400`} />;
    }
  };

  const filteredList = equipmentList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.pn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All Types" || item.type === filterType;
    const matchesStatus = filterStatus === "All Status" || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="font-sans w-full pb-8 text-left bg-gray-50 min-h-screen p-6 md:p-8">
      
      {/* HEADER (Add Button Restored for Admins) */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Equipment</h1>
          <p className="text-gray-500 mt-1 text-sm">Full administrative control over assets</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add Equipment
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" placeholder="Search by name, property no., or serial no..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none cursor-pointer" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
             <option>All Types</option><option>Laptop</option><option>Network</option><option>Tablet</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none cursor-pointer" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
             <option>All Status</option><option>Available</option><option>Borrowed</option><option>Under Maintenance</option>
          </select>
        </div>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredList.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full group">
            <div className="flex justify-between items-start mb-4">
               <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${getStatusStyle(item.status)}`}>{item.status}</span>
               <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Edit className="h-3.5 w-3.5" /></button>
                 <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="h-3.5 w-3.5" /></button>
               </div>
            </div>
            <div className="flex justify-center items-center py-6 mb-2">{getIcon(item.type)}</div>
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                <span className="text-xs font-bold text-blue-600">{item.condition}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">{item.model}</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono">PN: {item.pn}</p>
            </div>
            <button className="w-full py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <Eye className="h-3.5 w-3.5" /> View Details
            </button>
          </div>
        ))}
      </div>

      {/* --- MODAL: ADD EQUIPMENT --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Add New Equipment</h3>
              <button onClick={() => setShowAddModal(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <form className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Equipment Name</label><input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="e.g. Dell Latitude 5520" /></div>
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Type</label><select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"><option>Laptop</option><option>Tablet</option><option>Network</option></select></div>
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Property No.</label><input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="bzdvD243425" /></div>
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Serial No.</label><input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="sFD64581" /></div>
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Brand</label><input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="e.g. Mitsubishi" /></div>
              <div className="col-span-2 pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-gray-500 font-bold text-sm hover:bg-gray-50 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md">Add to Inventory</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}