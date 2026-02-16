import React, { useState, useEffect } from "react";
import { Eye, Rocket, X, Package, User, Calendar, RotateCcw, AlertTriangle } from "lucide-react";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  // Modal States
  const [viewRequest, setViewRequest] = useState(null);
  const [releaseRequest, setReleaseRequest] = useState(null);
  const [returnRequest, setReturnRequest] = useState(null);

  // Form States for Modals
  const [condition, setCondition] = useState("Good");
  const [remarks, setRemarks] = useState("");
  const [issueFlag, setIssueFlag] = useState("No Issues");

  // LOGIC: States for the rejection process
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  // 1. FETCH REQUESTS
  const fetchRequests = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch requests", err);
        setLoading(false);
      });
  };


  // LOGIC: Approve - Changes equipment to 'Borrowed'
  const handleApprove = async (id) => {
    setProcessing(true);
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        alert("✅ Request approved. Status is now 'Borrowed'.");
        fetchRequests(); // Refresh your list
      }
    } catch (error) {
      alert("❌ Error processing approval.");
    } finally {
      setProcessing(false);
    }
  };

  // LOGIC: Reject - Keeps equipment 'Available'
  const handleReject = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${selectedRequest.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason })
      });
      if (res.ok) {
        alert("❌ Request rejected. Equipment remains 'Available'.");
        setShowRejectModal(false);
        setRejectReason("");
        fetchRequests();
      }
    } catch (error) {
      alert("❌ Error processing rejection.");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. HANDLE RELEASE (Approved -> Active)
  const handleConfirmRelease = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${releaseRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: "Active", conditionOnRelease: condition, releaseRemarks: remarks })
      });
      
      if (res.ok) {
        alert("✅ Equipment Released Successfully!");
        setReleaseRequest(null);
        resetForm();
        fetchRequests();
      } else {
        alert("❌ Failed to release equipment.");
      }
    } catch (error) {
      alert("❌ Server error.");
    }
  };

  // 3. HANDLE RETURN (Active -> Returned)
  const handleConfirmReturn = async (e) => {
    e.preventDefault();
    try {
      const isDamaged = issueFlag !== "No Issues";
      const res = await fetch(`http://localhost:5000/api/requests/${returnRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: "Returned", 
          damaged: isDamaged,
          conditionOnReturn: condition, 
          returnNotes: remarks,
          issueFlag: issueFlag
        })
      });
      
      if (res.ok) {
        alert("✅ Equipment Returned Successfully!");
        setReturnRequest(null);
        resetForm();
        fetchRequests();
      } else {
        alert("❌ Failed to return equipment.");
      }
    } catch (error) {
      alert("❌ Server error.");
    }
  };

  const resetForm = () => {
    setCondition("Good");
    setRemarks("");
    setIssueFlag("No Issues");
  };

  // 4. CALCULATE TAB COUNTS DYNAMICALLY
  const counts = {
    All: requests.length,
    Pending: requests.filter(r => r.status === "Pending").length,
    Approved: requests.filter(r => r.status === "Approved").length,
    Active: requests.filter(r => r.status === "Active").length,
    Returned: requests.filter(r => r.status === "Returned").length,
  };

  // 5. FILTER REQUESTS BASED ON TAB
  const filteredRequests = requests.filter(req => {
    if (activeTab === "All") return true;
    return req.status === activeTab;
  });

  return (
    <div className="p-8 min-h-screen bg-gray-50/50 font-sans relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Review and process borrowing requests</p>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6">
        {["All", "Pending", "Approved", "Active", "Returned"].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab} <span className="opacity-70 ml-1">({counts[tab]})</span>
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Equipment</th>
              <th className="px-6 py-4 font-medium">Borrower</th>
              <th className="px-6 py-4 font-medium">Purpose</th>
              <th className="px-6 py-4 font-medium">Duration</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
               <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading requests...</td></tr>
            ) : filteredRequests.length === 0 ? (
               <tr><td colSpan={6} className="p-8 text-center text-gray-500">No requests found for this status.</td></tr>
            ) : (
              filteredRequests.map((req) => (
                <Row 
                  key={req.id}
                  request={req}
                  onView={() => setViewRequest(req)}
                  onRelease={() => { setReleaseRequest(req); resetForm(); }}
                  onReturn={() => { setReturnRequest(req); resetForm(); }}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: VIEW DETAILS */}
      {viewRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Request Details</h3>
              <button onClick={() => setViewRequest(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div>
                <span className={`px-3 py-1 rounded-md text-sm font-bold ${
                  viewRequest.status === "Approved" ? "bg-blue-100 text-blue-700" :
                  viewRequest.status === "Returned" ? "bg-emerald-100 text-emerald-700" :
                  viewRequest.status === "Rejected" ? "bg-red-100 text-red-700" : 
                  viewRequest.status === "Pending" ? "bg-amber-100 text-amber-700" :
                  viewRequest.status === "Active" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {viewRequest.status}
                </span>
              </div>

              {/* Equipment & Borrower Grid */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                    <Package className="h-4 w-4" /> Equipment
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Name</p>
                      <p className="text-sm font-medium text-gray-900">{viewRequest.item}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Type</p>
                      <p className="text-sm font-medium text-gray-900">{viewRequest.type}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <User className="h-4 w-4" /> Borrower
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Name</p>
                    <p className="text-sm font-medium text-gray-900">{viewRequest.user}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-sm font-medium text-gray-900">{viewRequest.email}</p>
                  </div>
                </div>
              </div>

              {/* Schedule Grid */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Calendar className="h-4 w-4" /> Schedule
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Request Date</p>
                    <p className="text-sm font-medium text-gray-900">Feb 4, 2026</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Duration</p>
                    <p className="text-sm font-medium text-gray-900">{viewRequest.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Released</p>
                    <p className="text-sm font-medium text-gray-900">{viewRequest.status === "Active" || viewRequest.status === "Returned" ? "Feb 4, 2026" : "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Returned</p>
                    <p className="text-sm font-medium text-gray-900">{viewRequest.status === "Returned" ? "Feb 4, 2026" : "-"}</p>
                  </div>
                </div>
              </div>

              {/* Purpose & Condition */}
              <div className="space-y-4">
                <div>
                   <p className="text-sm font-semibold text-gray-900 mb-2">Purpose</p>
                   <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100">
                     {viewRequest.purpose}
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Condition on Release</p>
                    <span className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium">Good</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Condition on Return</p>
                    <span className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium">
                      {viewRequest.status === "Returned" ? "Good" : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RELEASE EQUIPMENT */}
      {releaseRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start p-6 pb-2">
              <div>
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <Package className="h-5 w-5" />
                  <h3 className="text-xl font-bold text-gray-900">Release Equipment</h3>
                </div>
                <p className="text-sm text-gray-500">{releaseRequest.item} to {releaseRequest.user}</p>
              </div>
              <button onClick={() => setReleaseRequest(null)} className="text-gray-400 hover:text-gray-600 mt-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleConfirmRelease} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">Equipment Condition</label>
                <select 
                  value={condition} onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                >
                  <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">Remarks (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="Any notes about the release..."
                  value={remarks} onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => setReleaseRequest(null)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 w-[48%]">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 w-[48%]">
                  Confirm Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RECEIVE RETURNED EQUIPMENT */}
      {returnRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start p-6 pb-2">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <RotateCcw className="h-5 w-5" />
                  <h3 className="text-xl font-bold text-gray-900">Receive Returned Equipment</h3>
                </div>
                <p className="text-sm text-gray-500">{returnRequest.item} from {returnRequest.user}</p>
              </div>
              <button onClick={() => setReturnRequest(null)} className="text-gray-400 hover:text-gray-600 mt-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleConfirmReturn} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">Equipment Condition</label>
                <select 
                  value={condition} onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                  <AlertTriangle className="h-4 w-4" /> Issue Flag
                </label>
                <select 
                  value={issueFlag} onChange={(e) => setIssueFlag(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option>No Issues</option><option>Damaged</option><option>Lost</option><option>Late Return</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">Return Notes</label>
                <textarea 
                  rows={3}
                  placeholder="Any observations about the returned item..."
                  value={remarks} onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => setReturnRequest(null)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 w-[48%]">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 w-[48%]">
                  Confirm Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Sub-component for table rows
function Row({ request, onView, onRelease, onReturn }) {
  const { item, user, email, purpose, date, status, damaged } = request;
  
  const statusColor = 
    status === "Approved" ? "bg-blue-100 text-blue-700" :
    status === "Returned" ? "bg-emerald-100 text-emerald-700" :
    status === "Rejected" ? "bg-red-100 text-red-700" : 
    status === "Pending" ? "bg-amber-100 text-amber-700" :
    status === "Active" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700";

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4 font-bold text-gray-900">{item}</td>
      <td className="px-6 py-4 text-gray-900">
        {user}<br/>
        <span className="text-xs text-gray-500">{email}</span>
      </td>
      <td className="px-6 py-4 text-gray-600">{purpose}</td>
      <td className="px-6 py-4 text-xs text-gray-500">{date}</td>
      <td className="px-6 py-4 flex gap-2">
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${statusColor}`}>{status}</span>
        {damaged && <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-500 text-white">Damaged</span>}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2 items-center">
          <button onClick={onView} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
            <Eye className="h-4 w-4" />
          </button>
          
          {status === "Approved" && (
            <button 
              onClick={onRelease}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 shadow-sm transition-colors"
            >
              <Rocket className="h-3 w-3" /> Release
            </button>
          )}

          {status === "Active" && (
            <button 
              onClick={onReturn}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Return
              
            </button>


          )}
        </div>
      </td>
    </tr>
  );
}