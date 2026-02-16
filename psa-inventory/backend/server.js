const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const PDFDocument = require('pdfkit'); // Kept this one
const axios = require('axios');        // Kept this one
const nodemailer = require('nodemailer');

// 1. Import Routes
const maintenanceRoutes = require('./routes/maintenance');

// 2. Initialize App
const app = express();

// 3. Connect to Database
connectDB();

// 4. Middleware
app.use(cors());
app.use(express.json());

// 5. Use Routes
app.use('/api/maintenance', maintenanceRoutes);

// --- 1. MOCK DATABASE: USERS ---
let users = [
  { id: 1, employee_id: "PSA-001", name: "Jericho Daabay", contact_number: "0917-123-4567", role: "admin", email: "jerikoy2020@gmail.com", password: "password123", department: "Owner", position: "Head" },
  { id: 2, employee_id: "PSA-020", name: "Jerikoy 20", contact_number: "0998-765-4321", role: "user", email: "jerikoykoy@gmail.com", password: "password123", department: "IT", position: "Specialist" },
  { id: 3, employee_id: "PSA-045", name: "Jihad Manampan", contact_number: "0912-345-6789", role: "user", email: "jj.jed0981@gmail.com", password: "password123", department: "Operations", position: "Officer" },
  { id: 4, employee_id: "PSA-099", name: "oebims09", contact_number: "0956-000-1111", role: "user", email: "oebims09@gmail.com", password: "password123", department: "Logistics", position: "Staff" }
];

// --- 2. MOCK DATABASE: EQUIPMENT ---
let equipment = [
  { id: 1, name: "Ubiquiti UniFi AP", desc: "Ubiquiti UniFi AP AC Pro", pn: "PSA-AP-2024-001", sn: "UUAP-001", type: "Access Point", status: "Under Maintenance", condition: "Good" },
  { id: 2, name: "HP LaserJet Pro M404dn", desc: "HP LaserJet Pro M404dn", pn: "PSA-PRT-2024-001", sn: "HPM404-001", type: "Printer", status: "Borrowed", condition: "Excellent" },
  { id: 3, name: "JBL PartyBox 310", desc: "JBL PartyBox 310", pn: "PSA-SPK-2024-001", sn: "JBLPB310-001", type: "Speaker", status: "Available", condition: "Good" },
  { id: 4, name: "Dell Latitude 5520", desc: "Dell Latitude 5520", pn: "PSA-LAP-2024-001", sn: "DL5520-001", type: "Laptop", status: "Available", condition: "Excellent" },
  { id: 5, name: "Cisco Catalyst 2960", desc: "Cisco Catalyst 2960-X", pn: "PSA-SW-2024-001", sn: "CS2960-001", type: "Switch", status: "Available", condition: "Good" },
  { id: 6, name: "Samsung Galaxy Tab", desc: "Samsung Galaxy Tab S8", pn: "PSA-TAB-2024-002", sn: "SGT-002", type: "Tablet", status: "Available", condition: "Good" },
  { id: 7, name: "HP ProBook 450 G8", desc: "HP ProBook 450 G8", pn: "PSA-LAP-2024-003", sn: "HPP450-003", type: "Laptop", status: "Borrowed", condition: "Good" },
  { id: 8, name: "Cisco RV340", desc: "Cisco RV340", pn: "PSA-RTR-2024-001", sn: "CRV340-001", type: "Router", status: "Available", condition: "Excellent" },
];

// --- 3. MOCK DATABASE: REQUESTS ---
let requests = [
  { id: 1, item: "HP LaserJet Pro M404dn", type: "Printer", user: "oebims09", email: "oebims09@gmail.com", purpose: "dasd", date: "Feb 10 - Feb 11, 2026", status: "Approved", damaged: false },
  { id: 2, item: "Ubiquiti UniFi AP", type: "Access Point", user: "oebims09", email: "oebims09@gmail.com", purpose: "sdvdf", date: "Feb 10 - Feb 11, 2026", status: "Returned", damaged: true },
  { id: 3, item: "HP LaserJet Pro M404dn", type: "Printer", user: "oebims09", email: "oebims09@gmail.com", purpose: "for dada", date: "Feb 10 - Feb 13, 2026", status: "Rejected", damaged: false },
  { id: 4, item: "JBL PartyBox 310", type: "Speaker", user: "oebims09", email: "oebims09@gmail.com", purpose: "party", date: "Feb 10 - Feb 14, 2026", status: "Returned", damaged: false },
  { id: 5, item: "Ubiquiti UniFi AP", type: "Access Point", user: "oebims09", email: "oebims09@gmail.com", purpose: "none", date: "Feb 10 - Feb 11, 2026", status: "Pending", damaged: false },
  { id: 6, item: "Dell Latitude 5520", type: "Laptop", user: "Jihad Manampan", email: "jj.jed0981@gmail.com", purpose: "grrr", date: "Feb 4 - Feb 5, 2026", status: "Active", damaged: false },
  { id: 7, item: "iPad Pro 12.9", type: "Tablet", user: "Jerikoy 20", email: "jerikoykoy@gmail.com", purpose: "For academics", date: "Feb 4 - Feb 7, 2026", status: "Returned", damaged: false },
];

// --- 4. MOCK DATABASE: MAINTENANCE ---
let maintenanceRecords = [
  { id: 1, equipment: "Ubiquiti UniFi AP", type: "Repair", dueDate: "2026-02-15", technician: "John Doe", status: "In Progress", notes: "Fixing connection drops." },
  { id: 2, equipment: "HP LaserJet Pro M404dn", type: "Routine", dueDate: "2026-02-10", technician: "Jane Smith", status: "Overdue", notes: "Replace toner and drum." },
  { id: 3, equipment: "Cisco Catalyst 2960", type: "Inspection", dueDate: "2026-02-28", technician: "Mike Ross", status: "Scheduled", notes: "Quarterly port check." },
  { id: 4, equipment: "Dell Latitude 5520", type: "Repair", dueDate: "2026-01-20", technician: "Sarah Lee", status: "Completed", notes: "Replaced faulty battery." }
];

// --- 5. MOCK DATABASE: TRANSACTION LOGS ---
let transactionLogs = [
  { id: 1, date: "Feb 10, 6:44 AM", action: "Request Approved", equipment: "HP LaserJet Pro", performedBy: "Jericho Daabay", details: "Pending → Approved" },
  { id: 2, date: "Feb 10, 6:43 AM", action: "Request Submitted", equipment: "HP LaserJet Pro", performedBy: "oebims09", details: "Borrow request submitted" },
  { id: 3, date: "Feb 10, 1:43 AM", action: "Issue Flagged", equipment: "Ubiquiti UniFi AP", performedBy: "Jericho Daabay", details: "Issue flagged: Damaged" },
  { id: 4, date: "Feb 10, 1:43 AM", action: "Equipment Returned", equipment: "Ubiquiti UniFi AP", performedBy: "Jericho Daabay", details: "Released → Returned" },
  { id: 5, date: "Feb 10, 1:42 AM", action: "Request Rejected", equipment: "HP LaserJet Pro", performedBy: "Jericho Daabay", details: "Pending → Rejected" },
];

const getDashboardData = () => ({
  stats: { total: equipment.length, available: equipment.filter(e => e.status === 'Available').length, pending: requests.filter(r => r.status === 'Pending').length, overdue: 0 },
  requests: requests 
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'jerikoy2020@gmail.com', pass: 'xxxx xxxx xxxx xxxx' } 
});

// --- ALL ROUTES ---
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin' || email === 'admin@gmail.com' || email === 'jerikoy2020@gmail.com') {
    return res.json({ message: "Login success", role: "admin", name: "Jericho Daabay" });
  }
  const user = users.find(u => u.email === email);
  if (user) {
    res.json({ message: "Login success", role: user.role, name: user.name });
  } else {
    res.json({ message: "Login success", role: "user", name: email ? email.split('@')[0] : "Employee User" });
  }
});

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).json({ error: "Email already exists" });
  const newUser = { id: users.length + 1, employee_id: `PSA-${Math.floor(Math.random() * 1000)}`, name: name, contact_number: "N/A", role: "user", email: email, password: password, department: "Pending", position: "Pending" };
  users.push(newUser);
  res.json({ message: "Registration successful" });
});

app.get('/api/users', (req, res) => res.json(users));
app.get('/api/dashboard', (req, res) => res.json(getDashboardData()));
app.get('/api/requests', (req, res) => res.json(requests));
app.patch('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  const requestIndex = requests.findIndex(r => r.id === parseInt(id));
  if (requestIndex !== -1) {
    requests[requestIndex].status = req.body.status;
    res.json({ message: "Updated", request: requests[requestIndex] });
  } else res.status(404).json({ error: "Not found" });
});

app.post('/api/invite', async (req, res) => {
  const { email, role, employee_id } = req.body;
  const newUser = { id: users.length + 1, employee_id: employee_id || `PSA-${Math.floor(Math.random() * 1000)}`, name: email.split('@')[0], role: role || "user", email: email, department: "Pending", position: "Pending" };
  users.push(newUser);
  res.json({ message: "Invited", user: newUser });
});

app.get('/api/equipment', (req, res) => res.json(equipment));
app.post('/api/equipment', (req, res) => {
  const newItem = { id: equipment.length + 1, ...req.body };
  equipment.push(newItem);
  res.json({ message: "Added", item: newItem });
});
app.put('/api/equipment/:id', (req, res) => {
  const index = equipment.findIndex(e => e.id === parseInt(req.params.id));
  if (index !== -1) { equipment[index] = { ...equipment[index], ...req.body }; res.json({ message: "Updated", item: equipment[index] }); }
  else res.status(404).json({ error: "Not found" });
});
app.delete('/api/equipment/:id', (req, res) => {
  equipment = equipment.filter(e => e.id !== parseInt(req.params.id));
  res.json({ message: "Deleted" });
});

app.get('/api/maintenance', (req, res) => res.json(maintenanceRecords));
app.post('/api/maintenance', (req, res) => {
  const newRecord = { id: maintenanceRecords.length + 1, ...req.body };
  maintenanceRecords.push(newRecord);
  res.json({ message: "Logged", record: newRecord });
});
app.put('/api/maintenance/:id', (req, res) => {
  const index = maintenanceRecords.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) { maintenanceRecords[index] = { ...maintenanceRecords[index], ...req.body }; res.json({ message: "Updated" }); }
  else res.status(404).json({ error: "Not found" });
});
app.delete('/api/maintenance/:id', (req, res) => {
  maintenanceRecords = maintenanceRecords.filter(r => r.id !== parseInt(req.params.id));
  res.json({ message: "Deleted" });
});

app.get('/api/logs', (req, res) => {
  res.json(transactionLogs);
});

// --- REPORT EXPORT ROUTE ---
app.get('/api/reports/export', async (req, res) => {
  const { filter, format } = req.query;
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  // Mock Data (Replace with DB query later)
  const reportData = [
    { id: "EQ-001", name: "Dell Latitude 5520", category: "Laptop", status: "Borrowed", borrower: "Jericho Daabay", date: "2026-02-15" },
    { id: "EQ-002", name: "JBL PartyBox 310", category: "Speaker", status: "Available", borrower: "-", date: "2026-02-14" },
    { id: "EQ-003", name: "Cisco RV340", category: "Network", status: "Maintenance", borrower: "-", date: "2026-02-10" },
    { id: "EQ-004", name: "Epson Projector", category: "Projector", status: "Borrowed", borrower: "Juan Dela Cruz", date: "2026-02-08" },
    { id: "EQ-005", name: "Samsung Galaxy Tab", category: "Tablet", status: "Available", borrower: "-", date: "2026-02-01" },
  ];

  try {
    if (format === 'csv') {
      const headers = "ID,Equipment Name,Category,Status,Current Borrower,Last Updated\n";
      const rows = reportData.map(item => 
        `"${item.id}","${item.name}","${item.category}","${item.status}","${item.borrower}","${item.date}"`
      ).join("\n");

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=PSA_Report_${filter.replace(" ", "_")}.csv`);
      return res.status(200).send(headers + rows);
    } 
    
    else if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=PSA_Report_${filter.replace(" ", "_")}.pdf`);
      doc.pipe(res);

      // --- 1. HEADER SECTION ---
      try {
        const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Philippine_Statistics_Authority_%28PSA%29_logo.png';
        const logoResponse = await axios.get(logoUrl, { responseType: 'arraybuffer' });
        const logoBuffer = Buffer.from(logoResponse.data);
        
        doc.image(logoBuffer, 50, 45, { width: 60 }); 
      } catch (err) {
        console.log("Logo load failed, skipping...");
      }

      doc.font('Times-Roman').fontSize(10).text('Republic of the Philippines', 0, 50, { align: 'center' });
      doc.font('Times-Bold').fontSize(12).text('PHILIPPINE STATISTICS AUTHORITY', { align: 'center' });
      doc.font('Times-Roman').fontSize(10).text('Provincial Statistical Office', { align: 'center' });
      doc.moveDown(2);

      // Report Title
      doc.font('Helvetica-Bold').fontSize(16).text('EQUIPMENT INVENTORY REPORT', { align: 'center' });
      doc.fontSize(10).font('Helvetica').text(`Period Covered: ${filter} | Generated: ${currentDate}`, { align: 'center' });
      doc.moveDown(2);

      // --- 2. TABLE HEADER ---
      const tableTop = 200;
      const idX = 50;
      const nameX = 110;
      const catX = 280;
      const statusX = 350;
      const borrowerX = 450;

      doc.font('Helvetica-Bold').fontSize(9);
      doc.text('ID', idX, tableTop);
      doc.text('EQUIPMENT NAME', nameX, tableTop);
      doc.text('CATEGORY', catX, tableTop);
      doc.text('STATUS', statusX, tableTop);
      doc.text('BORROWER', borrowerX, tableTop);

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // --- 3. TABLE ROWS ---
      let y = tableTop + 25;
      doc.font('Helvetica').fontSize(9);

      reportData.forEach((item, index) => {
        if (index % 2 === 0) {
          doc.rect(50, y - 5, 500, 20).fill('#f5f5f5').stroke();
          doc.fillColor('black');
        }

        doc.text(item.id, idX, y);
        doc.text(item.name.substring(0, 25), nameX, y);
        doc.text(item.category, catX, y);
        
        if (item.status === 'Available') doc.fillColor('green');
        else if (item.status === 'Borrowed') doc.fillColor('blue');
        else doc.fillColor('red');
        
        doc.text(item.status, statusX, y);
        doc.fillColor('black');
        
        doc.text(item.borrower, borrowerX, y);
        
        y += 20;
      });

      doc.moveTo(50, y).lineTo(550, y).stroke();
      doc.moveDown(3);

      // --- 4. SIGNATURE BLOCK ---
      doc.y = y + 50;
      doc.font('Helvetica').fontSize(10).text('Certified Correct:', 50);
      doc.moveDown(2);
      
      doc.font('Helvetica-Bold').text('JERICHO DAABAY', 50);
      doc.font('Helvetica').text('System Administrator', 50);

      doc.end();
    } else {
      res.status(400).json({ message: "Invalid format" });
    }

  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).json({ message: "Server error" });
  }
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});