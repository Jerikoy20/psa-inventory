import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Monitor, 
  FileText, 
  Settings, 
  History, 
  BarChart3, 
  LogOut 
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  // Helper for active links styling
  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => 
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      isActive(path) 
        ? "bg-blue-100 text-blue-600 font-medium" 
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white fixed left-0 top-0">
      
      {/* 1. HEADER */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          {/* Using direct path for logo */}
        <img 
            src="https://upload.wikimedia.org/wikipedia/commons/2/2b/Philippine_Statistics_Authority_%28PSA%29_logo.png" 
            alt="PSA Logo" 
            className="h-14 w-auto drop-shadow-sm" 
          />
            <span className="text-lg font-bold text-blue-600 leading-none">OE-BIMS</span>
            <span className="text-[10px] text-gray-500 font-medium">PSA Provincial Office</span>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        
        {/* MAIN Section */}
        <div>
          <h3 className="mb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main
          </h3>
          <div className="space-y-1">
            <Link to="/" className={linkClass("/")}>
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link to="/equipment" className={linkClass("/equipment")}>
              <Monitor className="h-5 w-5" />
              Equipment
            </Link>
            <Link to="/requests" className={linkClass("/requests")}>
              <FileText className="h-5 w-5" />
              Requests
            </Link>
          </div>
        </div>

        {/* ADMIN Section - This is what was missing! */}
        <div>
          <h3 className="mb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Admin
          </h3>
          <div className="space-y-1">
            <Link to="/manage-equipment" className={linkClass("/manage-equipment")}>
              <Monitor className="h-5 w-5" />
              Manage Equipment
            </Link>
            <Link to="/transaction-logs" className={linkClass("/transaction-logs")}>
              <History className="h-5 w-5" />
              Transaction Logs
            </Link>
            <Link to="/reports" className={linkClass("/reports")}>
              <BarChart3 className="h-5 w-5" />
              Reports
            </Link>
          </div>
        </div>
      </div>

      {/* 3. USER PROFILE (Jericho Daabay) */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
            J
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-gray-900 truncate">Jericho Daabay</span>
            <span className="text-xs text-gray-500 truncate">Admin</span>
          </div>
          <button className="ml-auto text-gray-400 hover:text-red-500">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}