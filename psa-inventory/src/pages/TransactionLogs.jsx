import React, { useState } from "react";
import { 
  ClipboardList, Search, Filter, MoreVertical, Calendar, 
  CheckCircle, Clock, AlertTriangle, X, ArrowUpRight, ArrowDownLeft, User, FileText, FileDown
} from "lucide-react";

export default function TransactionLogs() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Mock Data
  const [logs, setLogs] = useState([
    { id: 1, user: "John Doe (HR)", equipment: "Epson L3210", action: "Borrowed", date: "2026-02-12", returnDate: "2026-02-15", status: "Active" },
    { id: 2, user: "Jane Smith (Admin)", equipment: "Dell Latitude 5520", action: "Returned", date: "2026-02-10", returnDate: "2026-02-10", status: "Completed" },
    { id: 3, user: "Mark Lee (IT)", equipment: "Cisco Catalyst 2960", action: "Borrowed", date: "2026-02-01", returnDate: "2026-02-05", status: "Overdue" },
  ]);

  const [newTransaction, setNewTransaction] = useState({ user: "", equipment: "", date: "", returnDate: "" });

  // --- HELPERS ---
  const getStatusColor = (status) => {
    switch(status) {
      case "Active": return "bg-blue-100 text-blue-700";
      case "Completed": return "bg-green-100 text-green-700";
      case "Overdue": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleBorrow = (e) => {
    e.preventDefault();
    const newLog = { id: logs.length + 1, ...newTransaction, action: "Borrowed", status: "Active" };
    setLogs([newLog, ...logs]);
    setShowModal(false);
  };

  const markReturned = (id) => {
    setLogs(logs.map(log => log.id === id ? { ...log, status: "Completed", action: "Returned", returnDate: new Date().toISOString().split('T')[0] } : log));
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "User,Equipment,Date,Return Date,Status\n"
      + logs.map(l => `${l.user},${l.equipment},${l.date},${l.returnDate},${l.status}`).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "transaction_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter(log => {
    const matchesTab = activeTab === "All" ? true : log.status === activeTab;
    const matchesSearch = log.equipment.toLowerCase().includes(searchTerm.toLowerCase()) || log.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    active: logs.filter(l => l.status === "Active").length,
    returned: logs.filter(l => l.status === "Completed").length,
    overdue: logs.filter(l => l.status === "Overdue").length,
    total: logs.length
  };

  return (
    <div className="font-sans w-full pb-8 text-left bg-gray-50 min-h-screen p-6 md:p-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Transaction Logs</h1>
          <p className="text-gray-500 mt-1 text-sm">Track equipment movement and user history</p>
        </div>
        <div className="flex gap-3">
          {/* EXPORT LOG BUTTON */}
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 shadow-sm transition-all active:scale-95"
          >
            <FileDown className="h-4 w-4" /> Export Log
          </button>
          
          {/* NEW BORROW BUTTON */}
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95"
          >
            <ArrowUpRight className="h-4 w-4" /> New Borrow
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Clock className="h-6 w-6" /></div>
          <div><h3 className="text-2xl font-bold text-gray-900">{stats.active}</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Borrows</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><CheckCircle className="h-6 w-6" /></div>
          <div><h3 className="text-2xl font-bold text-gray-900">{stats.returned}</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Returned</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><AlertTriangle className="h-6 w-6" /></div>
          <div><h3 className="text-2xl font-bold text-gray-900">{stats.overdue}</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Overdue</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><ClipboardList className="h-6 w-6" /></div>
          <div><h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Logs</p></div>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex bg-gray-200/50 p-1 rounded-xl">
          {['All', 'Active', 'Completed', 'Overdue'].map(tab => (
            <button
              key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" placeholder="Search user or equipment..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">User / Department</th>
                <th className="px-6 py-4">Equipment</th>
                <th className="px-6 py-4">Date Borrowed</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.length === 0 ? (
                <tr><td colSpan="6" className="py-12 text-center text-gray-400">No transactions found.</td></tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><User className="h-4 w-4" /></div>
                      <span className="font-bold text-gray-900">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{log.equipment}</td>
                  <td className="px-6 py-4 text-gray-500 flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {log.date}</td>
                  <td className="px-6 py-4 text-gray-500">{log.returnDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {log.status === "Active" || log.status === "Overdue" ? (
                      <button onClick={() => markReturned(log.id)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 hover:text-green-600 hover:border-green-200 rounded-lg text-xs font-bold transition-all shadow-sm">
                        <ArrowDownLeft className="h-3.5 w-3.5" /> Return
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs font-medium flex items-center justify-end gap-1"><CheckCircle className="h-3 w-3" /> Returned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: LOG TRANSACTION */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Log New Transaction</h3>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <form onSubmit={handleBorrow} className="p-6 space-y-4">
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">User / Dept</label>
                <input type="text" required placeholder="e.g. John Doe (HR)" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" onChange={(e) => setNewTransaction({...newTransaction, user: e.target.value})} />
              </div>
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Equipment</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none" onChange={(e) => setNewTransaction({...newTransaction, equipment: e.target.value})}>
                  <option>Select Equipment...</option><option>Dell Latitude 5520</option><option>Cisco Catalyst 2960</option><option>Epson L3210</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Borrow Date</label><input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})} /></div>
                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Return Date</label><input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" onChange={(e) => setNewTransaction({...newTransaction, returnDate: e.target.value})} /></div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-gray-500 font-bold text-sm hover:bg-gray-50 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 shadow-sm transition-all active:scale-95">Confirm Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}