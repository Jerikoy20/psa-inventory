const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  equipment: { type: String, required: true },
  type: { type: String, enum: ['Preventive', 'Repair', 'Cleaning', 'Inspection'], default: 'Preventive' },
  task: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  technician: { type: String, required: true },
  status: { type: String, enum: ['Upcoming', 'In Progress', 'Completed'], default: 'Upcoming' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);