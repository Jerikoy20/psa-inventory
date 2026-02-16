import React, { useState, useEffect } from "react";
import { 
  Wrench, Plus, Search, Filter, MoreVertical, Calendar, 
  CheckCircle, Clock, AlertTriangle, X, Play, Trash2, FileText, 
  RotateCcw, ChevronDown, ClipboardList, FileDown, Ban, DollarSign
} from "lucide-react";

export default function Maintenance() {
  const [activeTab, setActiveTab] = useState("In Progress");
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // Modal States
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showLogDropdown, setShowLogDropdown] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Form States
  const [scheduleData, setScheduleData] = useState({
    type: "Calibration", frequency: "Monthly", nextDue: "2026-12-02", tech: "", notes: ""
  });

  // Mock Data
  const [tasks, setTasks] = useState([
    { _id: "1", equipment: "HP ProBook 450 G8", type: "Software Update", date: "Feb 13, 2026", technician: "Jericho Daabay", status: "In Progress", priority: "Medium", cost: 0 },
    { _id: "2", equipment: "Dell Latitude 5520", type: "Cleaning", date: "Feb 12, 2026", technician: "Jericho Daabay", status: "In Progress", priority: "High", cost: 0 },
    { _id: "3", equipment: "Cisco Catalyst 2960", type: "Calibration", date: "Feb 12, 2026", technician: "—", status: "Scheduled", priority: "Medium", cost: 0 },
    { _id: "4", equipment: "HP ProBook 450 G8", type: "Software Update", date: "Feb 13, 2026", technician: "Jericho Daabay", status: "Completed", priority: "Medium", cost: 5000 },
  ]);

  // --- HANDLERS ---
  const handleComplete = (task) => {
    setSelectedTask(task);
    setShowCompleteModal(true);
  };

  const finalizeMaintenance = (e) => {
    e.preventDefault();
    setTasks(tasks.map(t => t._id === selectedTask._id ? { ...t, status: "Completed" } : t));
    setShowCompleteModal(false);
  };

  const addSchedule = (e) => {
    e.preventDefault();
    const newEntry = {
      _id: Date.now().toString(),
      equipment: selectedTask.name,
      type: scheduleData.type,
      date: scheduleData.nextDue,
      technician: "—",
      status: "Scheduled",
      priority: "Medium"
    };
    setTasks([...tasks, newEntry]);
    setShowScheduleModal(false);
  };

  // --- UI HELPERS ---
  const getFilteredTasks = () => {
    const term = searchTerm.toLowerCase();
    const base = tasks.filter(t => t.equipment.toLowerCase().includes(term));
    if (activeTab === "Upcoming") return base.filter(t => t.status === "Overdue" || t.status === "Upcoming");
    if (activeTab === "In Progress") return base.filter(t => t.status === "In Progress");
    if (activeTab === "Schedules") return base.filter(t => t.status === "Scheduled");
    return base.filter(t => t.status === "Completed" || t.status === "Cancelled");
  };

  const stats = {
    overdue: tasks.filter(t => t.status === "Overdue").length,
    dueWeek: tasks.filter(t => t.status === "Upcoming").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    completed: tasks.filter(t => t.status === "Completed").length
  };

  return (
    <div className="font-sans w-full pb-8 text-left bg-gray-50 min-h-screen p-6 md:p-8" onClick={() => { setOpenMenuId(null); setShowLogDropdown(false); }}>
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Maintenance Management</h1>
          <p className="text-gray-500 mt-1 text-sm">Schedule and track equipment maintenance</p>
        </div>
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowLogDropdown(!showLogDropdown); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
          >
            <Plus className="h-4 w-4" /> Log Maintenance <ChevronDown className="h-4 w-4" />
          </button>
          {showLogDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 animate-in zoom-in-95 duration-200">
              {["TECNO POVA 6PRO", "JBL PartyBox 310", "Dell Latitude 5520", "Cisco Catalyst 2960"].map(item => (
                <button key={item} onClick={() => { setSelectedTask({name: item}); setShowScheduleModal(true); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{item}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center"><AlertTriangle className="h-6 w-6" /></div>
          <div><h3 className="text-2xl font-bold text-gray-900">{stats.overdue}</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Overdue</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Calendar className="h-6 w-6" /></div>
          <div><h3 className="text-2xl font-bold text-gray-900">{stats.dueWeek}</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Due This Week</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><Clock className="h-6 w-6" /></div>
          <div><h3 className="text-2xl font-bold text-gray-900">{stats.inProgress}</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">In Progress</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center"><CheckCircle className="h-6 w-6" /></div>
          <div><h3 className="text-2xl font-bold text-gray-900">{stats.completed}</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Completed</p></div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex bg-gray-200/50 p-1 rounded-xl">
          {['Upcoming', 'In Progress', 'Schedules', 'History'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {tab} {tab === "In Progress" && stats.inProgress > 0 && `(${stats.inProgress})`}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search equipment..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible min-h-[400px]">
        {activeTab === "Schedules" && (
           <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Maintenance Schedules</h2>
              <button onClick={() => {setSelectedTask({name: "General"}); setShowScheduleModal(true)}} className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">
                <Plus className="h-3.5 w-3.5" /> Add Schedule
              </button>
           </div>
        )}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-gray-500 text-[11px] uppercase tracking-wider font-bold border-b border-gray-100">
              <tr>
                {activeTab === "History" ? <th className="px-4 py-4">Date</th> : null}
                <th className="px-4 py-4">Equipment</th>
                <th className="px-4 py-4">Type</th>
                {activeTab === "Schedules" ? <th className="px-4 py-4">Frequency</th> : null}
                <th className="px-4 py-4">{activeTab === "In Progress" ? "Started" : activeTab === "History" ? "Technician" : "Next Due"}</th>
                {activeTab !== "History" ? <th className="px-4 py-4">Technician</th> : null}
                {activeTab === "History" ? <th className="px-4 py-4">Cost</th> : null}
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {getFilteredTasks().map((task) => (
                <tr key={task._id} className="hover:bg-gray-50/50 transition-colors">
                  {activeTab === "History" ? <td className="px-4 py-5 text-gray-500 font-medium">Feb 13, 2026</td> : null}
                  <td className="px-4 py-5 font-bold text-gray-900">{task.equipment}</td>
                  <td className="px-4 py-5 text-gray-600">{task.type}</td>
                  {activeTab === "Schedules" ? <td className="px-4 py-5 text-gray-600">Monthly</td> : null}
                  <td className="px-4 py-5 text-gray-600 flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-gray-400" /> {task.date}</td>
                  {activeTab !== "History" ? <td className="px-4 py-5 text-gray-600">{task.technician}</td> : null}
                  {activeTab === "History" ? <td className="px-4 py-5 font-bold text-gray-900">₱{task.cost.toLocaleString()}</td> : null}
                  <td className="px-4 py-5">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{task.status}</span>
                  </td>
                  <td className="px-4 py-5 text-right">
                    {activeTab === "In Progress" && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleComplete(task)} className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700"><CheckCircle className="h-3.5 w-3.5" /> Complete</button>
                        <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg border border-gray-100"><Ban className="h-3.5 w-3.5" /></button>
                      </div>
                    )}
                    {(activeTab === "Schedules" || activeTab === "History") && (
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><MoreVertical className="h-4 w-4" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL: SCHEDULE MAINTENANCE --- */}
      {showScheduleModal && selectedTask && (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div><h3 className="text-xl font-bold text-gray-900">Schedule Maintenance</h3><p className="text-sm text-gray-500">Set up recurring maintenance for {selectedTask.name}</p></div>
              <button onClick={() => setShowScheduleModal(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <form onSubmit={addSchedule} className="p-6 space-y-4">
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-500 uppercase">Maintenance Type</label><select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" value={scheduleData.type} onChange={(e) => setScheduleData({...scheduleData, type: e.target.value})}><option>Preventive</option><option>Calibration</option><option>Cleaning</option></select></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-500 uppercase">Frequency</label><select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" value={scheduleData.frequency} onChange={(e) => setScheduleData({...scheduleData, frequency: e.target.value})}><option>Weekly</option><option>Monthly</option></select></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-500 uppercase">Next Due Date</label><input type="date" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" value={scheduleData.nextDue} onChange={(e) => setScheduleData({...scheduleData, nextDue: e.target.value})} /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-500 uppercase">Assigned Technician</label><input type="text" placeholder="Technician name" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" onChange={(e) => setScheduleData({...scheduleData, tech: e.target.value})} /></div>
              <div className="pt-4 flex gap-3">
                 <button type="button" onClick={() => setShowScheduleModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-lg text-sm">Cancel</button>
                 <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 shadow-md">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: COMPLETE MAINTENANCE --- */}
      {showCompleteModal && selectedTask && (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
               <div><h3 className="text-xl font-bold text-gray-900">Complete Maintenance</h3><p className="text-sm text-gray-500">Mark maintenance as complete for {selectedTask.equipment}</p></div>
               <button onClick={() => setShowCompleteModal(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <form onSubmit={finalizeMaintenance} className="p-6 space-y-4">
               <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-500 uppercase">Condition After Maintenance</label><select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"><option>Good</option><option>Excellent</option><option>Fair</option></select></div>
               <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-500 uppercase">Total Cost (₱)</label><input type="number" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" defaultValue="5000" /></div>
               <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-500 uppercase">Final Notes</label><textarea placeholder="Add any additional notes..." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm min-h-[80px] outline-none" /></div>
               <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-500 uppercase">Parts Replaced</label><textarea placeholder="List any parts replaced" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm min-h-[60px] outline-none" /></div>
               <div className="pt-4 flex gap-3">
                 <button type="button" onClick={() => setShowCompleteModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-lg text-sm">Cancel</button>
                 <button type="submit" className="flex-1 py-2.5 bg-green-600 text-white font-bold rounded-lg text-sm hover:bg-green-700 shadow-md">Complete</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}