import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Settings, 
  History, 
  BarChart3, 
  Wrench,
  LogOut,
  User,
  Users,
  CalendarRange, 
  ChevronUp
} from "lucide-react";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const rawRole = sessionStorage.getItem("userRole");
  const userRole = rawRole ? rawRole.toLowerCase() : "employee"; 
  const isAdmin = userRole === "admin";
  const userName = isAdmin ? "Jericho Daabay" : "Employee User";

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const NavItem = ({ name, path, icon: Icon }) => {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1 ${
          isActive 
            ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
        {name}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full fixed md:relative z-20">
        
        {/* --- HEADER (UPDATED WITH PSA LOGO) --- */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
             <img 
               src="psa-logo.png" 
               alt="PSA Logo" 
               className="h-12 w-auto" 
             />
            <div>
              <h1 className="font-bold text-lg text-gray-900 leading-tight">PSA | OE-BIMS</h1>
              <p className="text-xs text-gray-500">PSA Provincial Office</p>
            </div>
          </div>
        </div>
        {/* --- END HEADER UPDATE --- */}

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto py-4 custom-scrollbar">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Main</h3>
            <NavItem name="Dashboard" path="/dashboard" icon={LayoutDashboard} />
            <NavItem name="Equipment" path="/equipment" icon={Package} />
            <NavItem name="Requests" path="/requests" icon={ClipboardList} />
            <NavItem name="Reservations" path="/reservations" icon={CalendarRange} />
          </div>

          {isAdmin && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Admin</h3>
              <NavItem name="Manage Equipment" path="/manage-equipment" icon={Settings} />
              <NavItem name="Maintenance" path="/maintenance" icon={Wrench} />
              <NavItem name="Transaction Logs" path="/transaction-logs" icon={History} />
              <NavItem name="Reports" path="/reports" icon={BarChart3} />
              <NavItem name="Users" path="/users" icon={Users} />
            </div>
          )}
        </nav>

        {/* PROFILE FOOTER */}
        <div className="p-4 border-t border-gray-100 relative">
          {showProfileMenu && (
            <div className="absolute bottom-full left-4 mb-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 animate-in slide-in-from-bottom-2 z-50">
              <button 
                onClick={() => { setShowProfileMenu(false); navigate("/profile"); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="h-4 w-4 text-gray-500" /> Profile
              </button>
              <button 
                onClick={handleLogout} 
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
          
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-2 w-full hover:bg-gray-50 rounded-xl transition-colors text-left"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{userRole}</p>
            </div>
            <ChevronUp className={`h-4 w-4 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-0' : 'rotate-180'}`} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50">
        <Outlet />
      </main>
    </div>
  );
}