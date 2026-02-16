import React, { useState, useRef } from "react";
import { User, Mail, Briefcase, Phone, Building, Camera, Edit2, Shield, Calendar, Save, X, Clock, Wrench, Check, Bell } from "lucide-react";

export default function Profile() {
  // 1. DATA & STATE
  const rawRole = sessionStorage.getItem("userRole");
  const userRole = rawRole ? rawRole.toLowerCase() : "admin"; 
  const userName = sessionStorage.getItem("userName") || (userRole === "admin" ? "Jericho Daabay" : "Employee User");

  const [activeTab, setActiveTab] = useState("Profile Details");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
    name: userName,
    email: userRole === "admin" ? "jerikoy2020@gmail.com" : "employee@psa.gov.ph",
    phone: "-",
    role: userRole === "admin" ? "Administrator" : "Employee",
    department: "-",
    position: "-",
    created_at: "2/3/2026"
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    approved: true,
    rejected: true,
    released: true,
    returned: true,
    newRequest: true
  });

  // Image State
  const [profilePic, setProfilePic] = useState(`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=DBEAFE&color=2563EB&bold=true&size=150`);
  const fileInputRef = useRef(null);

  // 2. HANDLERS
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
      sessionStorage.setItem("profilePic", imageUrl);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      sessionStorage.setItem("userName", formData.name);
      setIsEditing(false);
      setSaving(false);
      alert("✅ Preferences & Profile updated successfully!");
      if (formData.name !== userName) window.location.reload(); 
    }, 800);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper for Profile Fields
  const ProfileField = ({ label, value, icon: Icon, fieldKey, isEditable = false }) => (
    <div className="mb-6">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" /> {label}
      </label>
      {isEditing && isEditable ? (
        <input 
          type="text" 
          value={formData[fieldKey]}
          onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900"
        />
      ) : (
        <p className="text-base font-medium text-gray-900">{value || "-"}</p>
      )}
    </div>
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50/50 font-sans relative">
      
      {/* 1. BLUE HEADER BANNER */}
      <div className="bg-blue-600 rounded-[20px] p-8 text-white shadow-lg shadow-blue-200/50 flex flex-col md:flex-row items-center gap-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="relative group">
          <img 
            src={sessionStorage.getItem("profilePic") || profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white/30 shadow-md object-cover bg-white"
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-blue-600 hover:bg-gray-50 transition-transform hover:scale-105 active:scale-95"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
        </div>

        <div className="text-center md:text-left flex-1 z-10">
          <h1 className="text-2xl font-bold">{formData.name}</h1>
          <p className="text-blue-100 text-sm mb-3">{formData.email}</p>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/20 flex items-center gap-2 w-fit mx-auto md:mx-0">
            <Shield className="h-3 w-3" /> {formData.role}
          </span>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex gap-6 border-b border-gray-100 mb-8 px-2">
        {["Profile Details", "Recent Activity", "Notifications"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === tab ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* 3. TAB CONTENT */}
      
      {/* --- TAB 1: PROFILE DETAILS --- */}
      {activeTab === "Profile Details" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Left: Personal Info */}
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                <p className="text-sm text-gray-500">Your personal details</p>
              </div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Edit2 className="h-4 w-4" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                   <button onClick={() => setIsEditing(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg"><X className="h-4 w-4" /></button>
                   <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200">
                      {saving ? "Saving..." : <><Save className="h-4 w-4" /> Save</>}
                   </button>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <ProfileField label="Full Name" value={formData.name} fieldKey="name" icon={User} isEditable={true} />
              <ProfileField label="Phone" value={formData.phone} fieldKey="phone" icon={Phone} isEditable={true} />
              <ProfileField label="Position" value={formData.position} fieldKey="position" icon={Briefcase} isEditable={true} />
            </div>
          </div>

          {/* Right: Account Info */}
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 flex flex-col h-full">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
              <p className="text-sm text-gray-500">These details are managed by administrators</p>
            </div>
            <div className="space-y-1 flex-1">
              <ProfileField label="Email" value={formData.email} icon={Mail} />
              <ProfileField label="Department" value={formData.department} fieldKey="department" icon={Building} isEditable={true} /> 
              <div className="mb-6">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" /> Role
                </label>
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                  {formData.role}
                </span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-50 text-xs text-gray-400 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Account created: {formData.created_at}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: RECENT ACTIVITY --- */}
      {activeTab === "Recent Activity" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Activity Log */}
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Clock className="h-5 w-5 text-blue-600" /> Activity Log</h3>
              <p className="text-sm text-gray-500">Your recent actions in the system</p>
            </div>
            <div className="space-y-6">
              {[
                { title: "Equipment Returned", item: "JBL PartyBox 310", desc: "Equipment returned by Jericho Daabay in Good condition", date: "Feb 11, 2026 7:51 AM", color: "bg-gray-100 text-gray-600" },
                { title: "Equipment Released", item: "JBL PartyBox 310", desc: "Equipment released to Jericho Daabay in Good condition", date: "Feb 11, 2026 7:51 AM", color: "bg-purple-50 text-purple-600" },
                { title: "Request Approved", item: "JBL PartyBox 310", desc: "OK", date: "Feb 11, 2026 7:50 AM", color: "bg-green-50 text-green-600" }
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">
                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${log.color}`}>{log.title}</span>
                    <h4 className="font-bold text-gray-900 text-sm mt-1">{log.item}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{log.desc}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Work */}
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 h-fit">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Wrench className="h-5 w-5 text-orange-600" /> Maintenance Work</h3>
              <p className="text-sm text-gray-500">Your recent maintenance activities</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start gap-4">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-orange-500">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">HP LaserJet Pro M404dn</h4>
                <div className="flex gap-2 mt-1 mb-2">
                  <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-semibold text-gray-600">Repair</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">In Progress</span>
                </div>
                <p className="text-xs text-gray-400">Feb 11, 2026</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: NOTIFICATIONS --- */}
      {activeTab === "Notifications" && (
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Bell className="h-5 w-5 text-blue-600" /> Email Notifications</h3>
            <p className="text-sm text-gray-500">Choose which email notifications you want to receive</p>
          </div>

          <div className="space-y-6 divide-y divide-gray-50">
            {[
              { id: "approved", label: "Request Approved", desc: "Get notified when your request is approved" },
              { id: "rejected", label: "Request Rejected", desc: "Get notified when your request is rejected" },
              { id: "released", label: "Equipment Released", desc: "Get notified when equipment is released to you" },
              { id: "returned", label: "Return Confirmed", desc: "Get notified when your return is confirmed" },
              { id: "newRequest", label: "New Request Submitted", desc: "Get notified when employees submit new requests", badge: "Admin" }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between pt-4 first:pt-0">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    {item.label}
                    {item.badge && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded font-bold">{item.badge}</span>}
                  </h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                {/* Toggle Switch */}
                <button 
                  onClick={() => toggleNotification(item.id)}
                  className={`w-11 h-6 flex items-center rounded-full transition-colors duration-200 focus:outline-none ${notifications[item.id] ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <span className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${notifications[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
              onClick={handleSave}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all active:scale-95"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}