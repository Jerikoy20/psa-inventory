import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create Context
const InventoryContext = createContext(null);

// 2. Export Hook
export const useInventory = () => {
  return useContext(InventoryContext);
};

// 3. Export Provider
export const InventoryProvider = ({ children }) => {
  
  // --- STATE: Active Users ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Jericho Daabay", role: "Admin", email: "jerikoy2020@gmail.com", department: "IT", position: "System Admin", employeeId: "EMP-001", isOwner: true },
      { id: 2, name: "Jihad Manampan", role: "Employee", email: "jj.jed0981@gmail.com", department: "Operations", position: "Staff", employeeId: "EMP-002", isOwner: false },
    ];
  });

  // --- STATE: Pending Users (Registration Requests) ---
  const [pendingUsers, setPendingUsers] = useState(() => {
    const saved = localStorage.getItem('pendingUsers');
    return saved ? JSON.parse(saved) : [
      { id: 101, name: "Sarah Intern", email: "sarah.intern@gmail.com", role: "Employee", department: "HR", position: "Intern", date: "2026-02-09" },
      { id: 102, name: "Mark Applicant", email: "mark.app@gmail.com", role: "Employee", department: "Admin", position: "Assistant", date: "2026-02-08" },
    ];
  });

  // --- STATE: Inventory & Requests ---
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('logs');
    return saved ? JSON.parse(saved) : [];
  });

  // --- AUTO-SAVE ---
  useEffect(() => { localStorage.setItem('inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers)); }, [pendingUsers]);
  useEffect(() => { localStorage.setItem('requests', JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem('logs', JSON.stringify(logs)); }, [logs]);

  // --- ACTIONS ---

  const addLog = (action, details) => {
    const newLog = { id: Date.now(), timestamp: new Date().toLocaleString(), action, details };
    setLogs(prev => [newLog, ...prev]);
  };

  const addEquipment = (item) => {
    setInventory(prev => [...prev, { ...item, id: Date.now() }]);
    addLog("Added Equipment", `Added ${item.name}`);
  };

  const updateEquipment = (updatedItem) => {
    setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    addLog("Updated Equipment", `Updated ${updatedItem.name}`);
  };

  const deleteEquipment = (id, name) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    addLog("Deleted Equipment", `Removed ${name}`);
  };

  const addRequest = (request) => {
    setRequests(prev => [...prev, { ...request, id: Date.now(), status: "Pending" }]);
    addLog("New Request", `Request for ${request.equipmentName}`);
  };

  // --- USER ACTIONS ---

  const addUser = (user) => {
    const newUser = { ...user, id: Date.now(), isOwner: false };
    setUsers(prev => [...prev, newUser]);
    addLog("User Invited", `Invited ${user.email}`);
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addLog("User Removed", `Removed user ID ${id}`);
  };

  // --- PENDING REQUEST ACTIONS (This makes the tabs work) ---

  const approveUser = (id) => {
    const userToApprove = pendingUsers.find(u => u.id === id);
    if (userToApprove) {
      // 1. Move to main Users list
      const newUser = { 
        ...userToApprove, 
        id: Date.now(), 
        employeeId: `EMP-${Math.floor(100 + Math.random() * 900)}` 
      };
      setUsers(prev => [...prev, newUser]);
      
      // 2. Remove from Pending
      setPendingUsers(prev => prev.filter(u => u.id !== id));
      addLog("User Approved", `Approved registration for ${userToApprove.email}`);
    }
  };

  const rejectUser = (id) => {
    const userToReject = pendingUsers.find(u => u.id === id);
    if (userToReject) {
      setPendingUsers(prev => prev.filter(u => u.id !== id));
      addLog("User Rejected", `Rejected registration for ${userToReject.email}`);
    }
  };

  const value = {
    inventory, requests, logs, users, pendingUsers,
    addEquipment, updateEquipment, deleteEquipment, addRequest,
    addUser, deleteUser, approveUser, rejectUser
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};