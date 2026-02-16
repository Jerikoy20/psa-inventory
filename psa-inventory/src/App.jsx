import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; 
import SignUp from "./pages/SignUp";               
import ForgotPassword from "./pages/ForgotPassword"; 
import Layout from "./Layout"; 

// Pages
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import Requests from "./pages/Requests";
import Reservations from "./pages/Reservations"; // 1. ADDED THIS IMPORT
import ManageEquipment from "./pages/ManageEquipment";
import Maintenance from "./pages/Maintenance"; 
import TransactionLogs from "./pages/TransactionLogs";
import Reports from "./pages/Reports";
import Users from "./pages/Users"; 
import Profile from './pages/Profile';  
import AdminEquipment from "./pages/AdminEquipment";

const ProtectedRoute = ({ children }) => {
  const userRole = sessionStorage.getItem("userRole");
  if (!userRole) return <Navigate to="/login" replace />;
  return children; 
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/equipment" element={<ProtectedRoute><Equipment /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        
        {/* 2. ADDED RESERVATIONS ROUTE HERE */}
        <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
        
        <Route path="/manage-equipment" element={<ProtectedRoute><ManageEquipment /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} /> 
        <Route path="/transaction-logs" element={<ProtectedRoute><TransactionLogs /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}