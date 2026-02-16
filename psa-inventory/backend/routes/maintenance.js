const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');

// GET all maintenance tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Maintenance.find().sort({ date: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new schedule
router.post('/', async (req, res) => {
  const task = new Maintenance(req.body);
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH: Update status (e.g., Start Job or Mark Completed)
router.patch('/:id', async (req, res) => {
  try {
    const updatedTask = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a schedule
router.delete('/:id', async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;