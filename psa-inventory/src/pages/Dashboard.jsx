import React, { useState, useEffect } from "react";
import { Monitor, CheckCircle2, Clock, AlertTriangle, UserPlus, X } from "lucide-react";

export default function Dashboard() {
  const rawRole = sessionStorage.getItem("userRole");
  const isAdmin = rawRole && rawRole.toLowerCase() === "admin";

  // State for Data
  const [stats, setStats] = useState({ total: 0, available: 0, pending: 0, overdue: 0 });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Invite Modal
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Employee"); // New Role State
  const [sending, setSending] = useState(false);
  fetch('http://127.0.0.1:5000/api/equipment')

  // 1. Fetch Data
  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setRequests(data.requests);
        setLoading(false);
      })
      .catch(err => console.error("Failed to fetch dashboard:", err));
  }, []);

  // 2. Handle Send Invite
  const handleInvite = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('http://localhost:5000/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });
      if (res.ok) {
        alert(`✅ Invitation sent to ${inviteEmail} as ${inviteRole}!`);
        setShowInvite(false);
        setInviteEmail("");
      } else {
        alert("❌ Failed to send invite.");
      }
    } catch (error) {
      alert("❌ Server error.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-8">Loading Dashboard...</div>;

  return (
    <div className="p-8 min-h-screen bg-gray-50/50 font-sans relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAdmin ? "Admin Dashboard" : "Dashboard"}</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of equipment inventory and borrowing activities</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <UserPlus className="h-4 w-4" /> Invite User
          </button>
        )}
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Equipment" value={stats.total} icon={Monitor} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Available" value={stats.available} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Pending Requests" value={stats.pending} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertTriangle} color="text-red-600" bg="bg-red-50" />
      </div>

      {/* RECENT REQUESTS TABLE */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Requests</h3>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Equipment</th>
              <th className="px-6 py-4 font-medium">Borrower</th>
              <th className="px-6 py-4 font-medium">Purpose</th>
              <th className="px-6 py-4 font-medium">Duration</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((req) => (
              <Row 
                key={req.id}
                item={req.item} 
                type={req.type} 
                user={req.user} 
                email={req.email} 
                purpose={req.purpose} 
                date={req.date} 
                status={req.status}
                damaged={req.damaged}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* INVITE USER MODAL (MATCHING YOUR SCREENSHOT) */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Invite User</h3>
              <button onClick={() => setShowInvite(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleInvite} className="p-6 space-y-5">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="user@psa.gov.ph"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>

              {/* Role Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">Role</label>
                <div className="relative">
                  <select 
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-gray-700"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                  {/* Custom Arrow Icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowInvite(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={sending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
                >
                  {sending ? "Sending..." : "Send Invitation"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// --- Sub Components ---
function StatCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`h-12 w-12 ${bg} ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}

function Row({ item, type, user, email, purpose, date, status, damaged }) {
  const statusColor = 
    status === "Approved" ? "bg-blue-100 text-blue-700" :
    status === "Returned" ? "bg-emerald-100 text-emerald-700" :
    status === "Rejected" ? "bg-red-100 text-red-700" : "bg-gray-100";

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4"><div className="font-bold text-gray-900">{item}</div><div className="text-xs text-gray-500">{type}</div></td>
      <td className="px-6 py-4"><div className="font-bold text-gray-900">{user}</div><div className="text-xs text-gray-500">{email}</div></td>
      <td className="px-6 py-4 text-gray-600">{purpose}</td>
      <td className="px-6 py-4 text-gray-600 text-xs">{date}</td>
      <td className="px-6 py-4 flex items-center gap-2">
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${statusColor}`}>{status}</span>
        {damaged && <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-500 text-white">Damaged</span>}
      </td>
    </tr>
  );
}