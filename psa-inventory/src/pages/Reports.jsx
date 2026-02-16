import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  PieChart, Pie, Cell, Tooltip, Legend 
} from "recharts";
import { 
  Package, Activity, AlertTriangle, AlertCircle, ChevronDown, Calendar, 
  Download, X, FileText, FileSpreadsheet 
} from "lucide-react";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  
  // FILTERS
  const [timeFilter, setTimeFilter] = useState("This Month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeOptions = ["This Week", "This Month", "This Year", "All Time"];

  // --- EXPORT MODAL STATE ---
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv"); // 'csv' or 'pdf'
  const [isExporting, setIsExporting] = useState(false);

  // --- MOCK DATA ---
  const stats = {
    totalEquipment: 15,
    totalRequests: 7,
    overdueItems: 0,
    issuesReported: 2
  };

  const statusDistribution = [
    { name: "Available", value: 9, color: "#3B82F6" }, 
    { name: "Borrowed", value: 2, color: "#10B981" }, 
    { name: "Reserved", value: 1, color: "#F59E0B" }, 
    { name: "Under Maintenance", value: 3, color: "#EF4444" },
  ];

  const typeData = [
    { name: "Printer", count: 3 },
    { name: "Router", count: 2 },
    { name: "Speaker", count: 2 },
    { name: "PC", count: 1 },
    { name: "CPU", count: 1 },
  ];

  const equipmentData = [
    { name: "HP LaserJet Pro M404dn", borrows: 2 },
    { name: "Ubiquiti UniFi AP", borrows: 2 },
    { name: "JBL PartyBox 310", borrows: 1 },
    { name: "Dell Latitude 5520", borrows: 1 },
    { name: "iPad Pro 12.9", borrows: 1 },
  ];

  const requestStatusData = [
    { name: "Returned", value: 5, color: "#3B82F6" }, 
    { name: "Rejected", value: 2, color: "#10B981" }, 
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, [timeFilter]); 

  // --- HANDLE EXPORT (Triggered from Modal) ---
  const handleConfirmExport = async () => {
    setIsExporting(true);
    try {
      // Connects to backend with selected format
      const response = await fetch(`http://localhost:5000/api/reports/export?filter=${timeFilter}&format=${exportFormat}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Report_${timeFilter.replace(" ", "_")}.${exportFormat}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setShowExportModal(false); // Close modal on success
      } else {
        alert("❌ Export failed. Backend not ready.");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("❌ Connection error. Is server running?");
    } finally {
      setIsExporting(false);
    }
  };

  const renderCustomizedLabel = ({ name, value }) => {
    return `${name}: ${value}`;
  };

  if (loading && timeFilter === "This Month") {
    return <div className="p-8 text-center text-gray-500">Loading reports...</div>;
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50/50 font-sans relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1 text-sm">Equipment usage insights and statistics</p>
        </div>
        
        {/* BUTTONS */}
        <div className="flex items-center gap-3">
          
          {/* Export Button (Opens Modal) */}
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 shadow-sm transition-all active:scale-95"
          >
            <Download className="h-4 w-4 text-blue-600" />
            Export Log
          </button>

          {/* Date Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-all"
            >
              <Calendar className="h-4 w-4 text-gray-500" />
              {timeFilter}
              <ChevronDown className={`h-4 w-4 text-gray-400 ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 animate-in fade-in slide-in-from-top-2">
                  {timeOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setTimeFilter(option);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        timeFilter === option ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-700 hover:bg-gray-50 font-medium"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Total Equipment</p>
              <h3 className="text-2xl font-bold text-gray-900 leading-none">{stats.totalEquipment}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package className="h-5 w-5" /></div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Total Requests</p>
              <h3 className="text-2xl font-bold text-gray-900 leading-none">{stats.totalRequests}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Activity className="h-5 w-5" /></div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Overdue Items</p>
              <h3 className="text-2xl font-bold text-red-600 leading-none">{stats.overdueItems}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle className="h-5 w-5" /></div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Issues Reported</p>
              <h3 className="text-2xl font-bold text-amber-600 leading-none">{stats.issuesReported}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle className="h-5 w-5" /></div>
          </div>
        </div>

        {/* CHARTS (Unchanged) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Equipment by Status</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value">
                    {statusDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="square" iconSize={10} wrapperStyle={{ fontSize: '12px', color: '#4B5563', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Equipment by Type</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#E5E7EB" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={{ stroke: '#D1D5DB' }} tickLine={false} domain={[0, 3]} ticks={[0, 0.75, 1.5, 2.25, 3]} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={{ stroke: '#D1D5DB' }} tickLine={false} width={60} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Most Borrowed Equipment</h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={equipmentData} margin={{ top: 10, right: 10, left: -20, bottom: 90 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" dx={-5} dy={5} interval={0} tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#D1D5DB' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={{ stroke: '#D1D5DB' }} tickLine={false} domain={[0, 2]} ticks={[0, 0.5, 1, 1.5, 2]} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} />
                  <Bar dataKey="borrows" fill="#10B981" radius={[2, 2, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Request Status Distribution</h3>
            <div className="h-[320px] w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={requestStatusData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={renderCustomizedLabel} labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}>
                    {requestStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* --- EXPORT MODAL --- */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setShowExportModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Export Report</h3>
              <button onClick={() => setShowExportModal(false)}><X className="h-5 w-5 text-gray-400 hover:text-red-500" /></button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                You are exporting the report for <strong>{timeFilter}</strong>. 
                Please select your preferred format.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setExportFormat("csv")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    exportFormat === "csv" 
                      ? "border-blue-600 bg-blue-50 text-blue-700" 
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <FileSpreadsheet className="h-6 w-6" />
                  <span className="text-xs font-bold">CSV (Excel)</span>
                </button>

                <button 
                  onClick={() => setExportFormat("pdf")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    exportFormat === "pdf" 
                      ? "border-red-600 bg-red-50 text-red-700" 
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <FileText className="h-6 w-6" />
                  <span className="text-xs font-bold">PDF Document</span>
                </button>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setShowExportModal(false)} 
                  className="flex-1 py-2.5 text-gray-600 font-bold text-sm hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmExport}
                  disabled={isExporting}
                  className="flex-1 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-gray-800 shadow-md flex items-center justify-center gap-2"
                >
                  {isExporting ? "Exporting..." : "Download File"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}