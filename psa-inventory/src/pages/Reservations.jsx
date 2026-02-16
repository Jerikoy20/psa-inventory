import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Plus, 
  Clock, CheckCircle, ChevronDown, X, Eye, User, FileText, ArrowRight, Ban, Check
} from "lucide-react";

export default function Reservations() {
  // --- STATE ---
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); 
  const [view, setView] = useState("Calendar");
  const [showModal, setShowModal] = useState(false); 
  const [selectedRes, setSelectedRes] = useState(null); 
  const [listFilter, setListFilter] = useState("All");
  
  // NEW: State for the Equipment Dropdown
  const [equipmentFilter, setEquipmentFilter] = useState("All Equipment");

  // --- DATA ---
  const [reservations, setReservations] = useState([
    { 
      id: 1, title: "Cisco Catalyst 2960", type: "Switch",
      start: "2026-02-13", end: "2026-02-14", 
      user: "Jericho Daabay", email: "jerikoy2020@gmail.com", purpose: "Network Upgrade",
      status: "Pending", color: "bg-amber-500", statusBadge: "bg-amber-100 text-amber-700"
    },
    { 
      id: 2, title: "JBL PartyBox 310", type: "Speaker",
      start: "2026-02-12", end: "2026-02-12", 
      user: "Jericho Daabay", email: "jerikoy2020@gmail.com", purpose: "Office Event",
      status: "Converted", color: "bg-blue-600", statusBadge: "bg-blue-100 text-blue-700"
    },
    { 
      id: 3, title: "Dell Latitude 5520", type: "Laptop",
      start: "2026-02-13", end: "2026-02-15", 
      user: "Jericho Daabay", email: "jerikoy2020@gmail.com", purpose: "Academics",
      status: "Converted", color: "bg-blue-600", statusBadge: "bg-blue-100 text-blue-700"
    },
  ]);

  const [newRes, setNewRes] = useState({ equipment: "", startDate: "", endDate: "", purpose: "" });

  // --- HANDLERS ---
  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = reservations.length + 1;
    const newEntry = {
      id: newId,
      title: newRes.equipment || "New Equipment",
      type: "Device",
      start: newRes.startDate,
      end: newRes.endDate,
      user: sessionStorage.getItem("userName") || "Jericho Daabay",
      email: "jerikoy2020@gmail.com",
      purpose: newRes.purpose,
      status: "Pending",
      color: "bg-amber-500",
      statusBadge: "bg-amber-100 text-amber-700"
    };
    setReservations([...reservations, newEntry]);
    setShowModal(false);
    setNewRes({ equipment: "", startDate: "", endDate: "", purpose: "" });
  };

  const handleStatusAction = () => {
    if (!selectedRes) return;
    let newStatus = selectedRes.status;
    let newBadge = selectedRes.statusBadge;
    let newColor = selectedRes.color;

    if (selectedRes.status === "Pending") {
      newStatus = "Confirmed";
      newBadge = "bg-green-100 text-green-700";
      newColor = "bg-green-500";
    } else if (selectedRes.status === "Confirmed") {
      newStatus = "Converted";
      newBadge = "bg-blue-100 text-blue-700";
      newColor = "bg-blue-600";
    }

    const updatedReservations = reservations.map(r => 
      r.id === selectedRes.id 
        ? { ...r, status: newStatus, statusBadge: newBadge, color: newColor } 
        : r
    );

    setReservations(updatedReservations);
    setSelectedRes(null);
  };

  // --- FILTERING LOGIC ---
  
  // 1. Get unique equipment names for the dropdown options
  const uniqueEquipment = ["All Equipment", ...new Set(reservations.map(r => r.title))];

  // 2. Filter logic for List View
  const getFilteredList = () => {
    let filtered = reservations;

    // Filter by Dropdown first
    if (equipmentFilter !== "All Equipment") {
      filtered = filtered.filter(r => r.title === equipmentFilter);
    }

    // Then filter by Tabs (All/Upcoming/etc)
    if (listFilter === "All") return filtered;
    if (listFilter === "Upcoming") return filtered.filter(r => new Date(r.start) > new Date());
    return filtered.filter(r => r.status === listFilter || (r.status === "Converted" && listFilter === "Confirmed"));
  };
  const filteredReservations = getFilteredList();

  // --- CALENDAR RENDERER ---
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50/30 border-b border-r border-gray-100"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // 3. Filter logic for Calendar View (Date + Dropdown)
      const daysEvents = reservations.filter(res => {
        const isDateMatch = dateStr >= res.start && dateStr <= res.end;
        const isEquipmentMatch = equipmentFilter === "All Equipment" || res.title === equipmentFilter;
        return isDateMatch && isEquipmentMatch;
      });

      const isSelectedDay = day === 12 && currentDate.getMonth() === 1 && year === 2026; 

      days.push(
        <div key={day} className={`h-32 border-b border-r border-gray-100 p-2 relative transition-colors group ${isSelectedDay ? 'bg-blue-50/30' : 'bg-white hover:bg-gray-50'}`}>
          <span className={`text-sm font-semibold ${isSelectedDay ? "text-blue-600" : "text-gray-700"}`}>{day}</span>
          <div className="mt-2 space-y-1 overflow-y-auto max-h-[85px]">
            {daysEvents.map((ev, idx) => (
              <div 
                key={`${ev.id}-${idx}`} 
                onClick={(e) => { e.stopPropagation(); setSelectedRes(ev); }}
                className={`text-[11px] px-2 py-1 rounded text-white font-medium truncate shadow-sm cursor-pointer hover:opacity-90 active:scale-95 transition-all ${ev.color}`}
              >
                {ev.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const formatLongDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const stats = {
    upcoming: reservations.filter(r => new Date(r.start) > new Date()).length,
    pending: reservations.filter(r => r.status === "Pending").length,
    total: reservations.length
  };

  return (
    <div className="font-sans w-full pb-8 text-left bg-gray-50 min-h-screen p-6 md:p-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="text-2xl font-bold text-gray-900 tracking-tight">Equipment Reservations</h1><p className="text-gray-500 mt-1 text-sm">Manage equipment reservations</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all active:scale-95"><Plus className="h-4 w-4" /> New Reservation</button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><CalendarIcon className="h-6 w-6" /></div>
          <div><h3 className="text-2xl font-bold text-gray-900">{stats.upcoming}</h3><p className="text-xs text-gray-500 font-medium">Upcoming</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Clock className="h-6 w-6" /></div>
          <div><h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3><p className="text-xs text-gray-500 font-medium">Pending Approval</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><List className="h-6 w-6" /></div>
          <div><h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3><p className="text-xs text-gray-500 font-medium">Total Reservations</p></div>
        </div>
      </div>

      {/* VIEW TOGGLE */}
      <div className="flex items-center gap-1 bg-gray-200/50 p-1 rounded-xl w-fit mb-6">
        <button onClick={() => setView("Calendar")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === "Calendar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}><CalendarIcon className="h-4 w-4" /> Calendar View</button>
        <button onClick={() => setView("List")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === "List" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}><List className="h-4 w-4" /> List View</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
        {view === "Calendar" ? (
          <>
            <div className="p-6 pb-4 border-b border-gray-100">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-3">
                     <button onClick={handlePrevMonth} className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm bg-white"><ChevronLeft className="h-5 w-5" /></button>
                     <h2 className="text-xl font-bold text-gray-900 min-w-[140px] text-center">{monthName} {year}</h2>
                     <button onClick={handleNextMonth} className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm bg-white"><ChevronRight className="h-5 w-5" /></button>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                     
                     {/* --- UPDATED DROPDOWN --- */}
                     <div className="relative flex-1 md:flex-none">
                        <select 
                          value={equipmentFilter}
                          onChange={(e) => setEquipmentFilter(e.target.value)}
                          className="w-full md:w-48 appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm font-medium bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-sm"
                        >
                          {uniqueEquipment.map((equip, index) => (
                            <option key={index} value={equip}>{equip}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                     </div>

                     <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95 whitespace-nowrap"><Plus className="h-4 w-4" /> Reserve</button>
                  </div>
               </div>
               <div className="flex items-center gap-6 mt-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600"><span className="w-3 h-3 rounded-full bg-amber-400"></span> Pending</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600"><span className="w-3 h-3 rounded-full bg-green-500"></span> Confirmed</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Converted</div>
               </div>
            </div>
            <div className="grid grid-cols-7 border-b border-gray-100 bg-white">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 bg-white">{renderCalendarDays()}</div>
          </>
        ) : (
          <div className="p-6">
            {/* List View Tabs */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3">
                {['All', 'Upcoming', 'Pending', 'Confirmed'].map(tab => {
                  const isActive = listFilter === tab;
                  return <button key={tab} onClick={() => setListFilter(tab)} className={`px-5 py-2 rounded-md text-sm font-bold transition-all border ${isActive ? "bg-[#0f172a] text-white border-[#0f172a]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>{tab}</button>;
                })}
              </div>
              
              {/* Optional: Add Dropdown to List View as well */}
              <div className="relative w-48 hidden md:block">
                 <select 
                    value={equipmentFilter}
                    onChange={(e) => setEquipmentFilter(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-xs font-bold bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    {uniqueEquipment.map((equip, index) => (
                      <option key={index} value={equip}>{equip}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-500 border-b border-gray-100 text-xs uppercase tracking-wider">
                  <tr><th className="pb-4 font-semibold w-1/4">Equipment</th><th className="pb-4 font-semibold w-1/4">Reserved By</th><th className="pb-4 font-semibold w-1/6">Period</th><th className="pb-4 font-semibold w-1/6">Purpose</th><th className="pb-4 font-semibold w-1/12">Status</th><th className="pb-4 font-semibold w-1/12 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredReservations.length === 0 ? <tr><td colSpan="6" className="py-8 text-center text-gray-400 text-sm">No reservations found.</td></tr> : filteredReservations.map(res => (
                    <tr key={res.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4 align-top"><p className="text-sm font-bold text-gray-900">{res.title}</p><p className="text-xs text-gray-500 mt-0.5">{res.type}</p></td>
                      <td className="py-4 align-top"><p className="text-sm font-medium text-gray-900">{res.user}</p><p className="text-xs text-gray-500 mt-0.5">{res.email}</p></td>
                      <td className="py-4 align-top"><p className="text-sm text-gray-900">{formatDate(res.start)}</p><p className="text-xs text-gray-500 mt-0.5">to {formatDate(res.end)}</p></td>
                      <td className="py-4 align-top"><p className="text-sm text-gray-600">{res.purpose}</p></td>
                      <td className="py-4 align-top"><span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${res.statusBadge}`}>{res.status}</span></td>
                      <td className="py-4 align-top text-right"><button onClick={() => setSelectedRes(res)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"><Eye className="h-3 w-3" /> View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* NEW RESERVATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center p-6 border-b border-gray-100"><h3 className="text-xl font-bold text-gray-900">New Reservation</h3><button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-gray-400 hover:text-gray-600" /></button></div>
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
               <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Equipment</label><select required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={newRes.equipment} onChange={(e) => setNewRes({...newRes, equipment: e.target.value})}><option value="">Select Equipment...</option><option>JBL PartyBox 310</option><option>Cisco Catalyst 2960</option><option>Dell Latitude 5520</option></select></div>
               <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Purpose</label><input type="text" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={newRes.purpose} onChange={(e) => setNewRes({...newRes, purpose: e.target.value})} /></div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Start Date</label><input type="date" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={newRes.startDate} onChange={(e) => setNewRes({...newRes, startDate: e.target.value})} /></div>
                 <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">End Date</label><input type="date" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={newRes.endDate} onChange={(e) => setNewRes({...newRes, endDate: e.target.value})} /></div>
               </div>
               <div className="pt-4 flex justify-end gap-3 mt-2"><button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-500 font-bold text-sm hover:bg-gray-50 rounded-lg">Cancel</button><button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md">Confirm</button></div>
             </form>
           </div>
        </div>
      )}

      {/* RESERVATION DETAILS MODAL */}
      {selectedRes && (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Reservation Details</h3>
              <div className="flex items-center gap-3">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedRes.statusBadge.replace('bg-', 'bg-opacity-20 ')}`}>{selectedRes.status}</span>
                 <button onClick={() => setSelectedRes(null)}><X className="h-5 w-5 text-gray-400 hover:text-gray-600" /></button>
              </div>
            </div>
            <div className="p-6 space-y-6">
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><h4 className="font-bold text-gray-900 text-base">{selectedRes.title}</h4><p className="text-sm text-gray-500 mt-0.5">{selectedRes.type}</p></div>
               <div className="space-y-5">
                  <div className="flex gap-4"><div className="mt-0.5"><User className="h-5 w-5 text-gray-400" /></div><div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reserved by</p><p className="text-sm font-bold text-gray-900 mt-0.5">{selectedRes.user}</p><p className="text-xs text-gray-500">{selectedRes.email}</p></div></div>
                  <div className="flex gap-4"><div className="mt-0.5"><CalendarIcon className="h-5 w-5 text-gray-400" /></div><div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reservation Period</p><p className="text-sm font-bold text-gray-900 mt-0.5">{formatLongDate(selectedRes.start)} - {formatLongDate(selectedRes.end)}</p></div></div>
                  <div className="flex gap-4"><div className="mt-0.5"><FileText className="h-5 w-5 text-gray-400" /></div><div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Purpose</p><p className="text-sm font-medium text-gray-900 mt-0.5">{selectedRes.purpose}</p></div></div>
               </div>
               <div><p className="text-sm font-bold text-gray-900 mb-2">Remarks (optional)</p><textarea className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[80px]" placeholder="Add any notes..."></textarea></div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
               {selectedRes.status !== "Converted" && (
                 <button onClick={handleStatusAction} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95">
                    {selectedRes.status === "Pending" ? <> <Check className="h-4 w-4" /> Confirm </> : <> <ArrowRight className="h-4 w-4" /> Convert to Borrow </>}
                 </button>
               )}
               <button onClick={() => setSelectedRes(null)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"><Ban className="h-4 w-4" /> Cancel</button>
               <button onClick={() => setSelectedRes(null)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}