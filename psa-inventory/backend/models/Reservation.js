const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: String, required: true },
  start: { type: String, required: true }, // Format: YYYY-MM-DD
  end: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  color: { type: String, default: 'bg-amber-500' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);