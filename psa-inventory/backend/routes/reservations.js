const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// ... (Keep existing GET and POST routes) ...

// PATCH: Update Reservation Status (Approve/Reject)
router.patch('/:id', async (req, res) => {
  try {
    const updatedRes = await Reservation.findByIdAndUpdate(
      req.params.id,
      { 
        status: req.body.status,
        color: req.body.status === 'Confirmed' ? 'bg-green-500' : 'bg-red-500' // Auto-update color
      },
      { new: true } // Return the updated document
    );
    res.json(updatedRes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove Reservation
router.delete('/:id', async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;