import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Plus, X, Filter,
  Smartphone, Laptop, Monitor, Speaker, Router, Tablet, 
  Tag, Hash, MapPin
} from "lucide-react";

export default function Equipment() {
  const navigate = useNavigate();

  // --- ROLE CHECK ---
  // We pull the role from sessionStorage to determine what to show
  const rawRole = sessionStorage.getItem("userRole");
  const userRole = rawRole ? rawRole.toLowerCase() : "employee"; 
  const isAdmin = userRole === "admin";

  // --- STATE ---
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [borrowForm, setBorrowForm] = useState({ 
    purpose: "", 
    neededFrom: new Date().toISOString().split('T')[0], 
    neededUntil: "" 
  });

  // Pulling real name from session if available
  const userName = sessionStorage.getItem("userName") || "Employee User";
  const userEmail = sessionStorage.getItem("userEmail") || "user@psa.gov.ph";

  const fetchEquipment = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/equipment')
      .then(res => res.json())
      .then(data => { 
        setItems(Array.isArray(data) ? data : []); 
        setLoading(false); 
      })
      .catch(err => { console.error("Fetch error:", err); setLoading(false); });
  };

  useEffect(() => { fetchEquipment(); }, []);

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        equipmentId: selectedItem.id,
        equipmentName: selectedItem.name,
        borrower: userName,
        email: userEmail,
        ...borrowForm
      };
      const res = await fetch('http://localhost:5000/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("✅ Request Submitted!");
        setShowBorrowModal(false);
        fetchEquipment();
      } else alert("❌ Failed to send request.");
    } catch (error) { alert("❌ Connection Error"); }
  };

  const openView = (item) => { setSelectedItem(item); setShowViewModal(true); };
  const openBorrow = (item) => { 
    setSelectedItem(item); 
    setBorrowForm({ purpose: "", neededFrom: new Date().toISOString().split('T')[0], neededUntil: "" });
    setShowBorrowModal(true); 
  };

  const filteredItems = items.filter(item => {
    if (!item) return false;
    const matchesSearch = (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.pn || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All Types" || item.type === typeFilter;
    const statusText = statusFilter === "All Status" ? "All Status" : statusFilter;
    const matchesStatus = statusText === "All Status" || item.status === statusText;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getIcon = (type) => {
    switch(type) {
      case 'Laptop': return <Laptop className="h-12 w-12" />;
      case 'Phone': return <Smartphone className="h-12 w-12" />;
      case 'Tablet': return <Tablet className="h-12 w-12" />;
      case 'Speaker': return <Speaker className="h-12 w-12" />;
      case 'Router': return <Router className="h-12 w-12" />;
      default: return <Monitor className="h-12 w-12" />;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Available': return "bg-emerald-100 text-emerald-700";
      case 'Borrowed': return "bg-blue-100 text-blue-700";
      case 'Under Maintenance': return "bg-orange-100 text-orange-700";
      case 'Reserved': return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Inventory...</div>;

  return (
    <div className="p-8 min-h-screen bg-gray-50/50 font-sans text-left relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Equipment Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">Browse and request available equipment</p>
        </div>
        
        {/* --- ROLE PROTECTION: Only show 'Add Equipment' to Admins --- */}
        {isAdmin && (
          <button 
            onClick={() => navigate('/manage-equipment')} 
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4" /> Add Equipment
          </button>
        )}
      </div>

      {/* --- SEARCH & FILTERS (Same as before) --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm" 
            placeholder="Search by name, property no., or serial no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
             <select className="pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
               <option>All Types</option><option>Laptop</option><option>Printer</option><option>Speaker</option><option>Router</option>
             </select>
          </div>
          <div className="relative">
             <select className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
               <option>All Status</option><option>Available</option><option>Borrowed</option><option>Under Maintenance</option>
             </select>
          </div>
        </div>
      </div>

      {/* --- EQUIPMENT GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <div key={item.id || index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group relative flex flex-col h-full">
            <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${getStatusBadge(item.status)}`}>
              {item.status}
            </span>
            <div className="h-32 w-full bg-gray-50/50 rounded-xl mb-4 flex items-center justify-center text-gray-300 group-hover:text-blue-500 transition-colors">
              {getIcon(item.type)}
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 truncate text-base pr-2">{item.name}</h3>
                <span className="text-xs font-bold shrink-0 text-blue-600">{item.condition || "Good"}</span>
              </div>
              <p className="text-sm text-slate-500 mb-0.5">{item.desc || "Standard Issue"}</p>
              <p className="text-xs text-gray-400 font-mono">PN: {item.pn || "Pending"}</p>
            </div>
            <div className="flex gap-3 mt-auto pt-2">
              <button onClick={() => openView(item)} className="flex-1 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">View</button>
              {item.status === 'Available' && (
                <button onClick={() => openBorrow(item)} className="flex-1 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors">Borrow</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODALS (Same as before) */}
      {/* ... View and Borrow modal code goes here ... */}

    </div>
  );
}