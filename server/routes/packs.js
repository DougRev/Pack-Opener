const express = require('express');
const router = express.Router();
const Pack = require('../models/Pack');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // Assuming you have an admin middleware

// Middleware to check if the user is an admin
const requireAdmin = [auth, admin];

// GET endpoint to list all packs
router.get('/', auth, async (req, res) => {
  try {
    const packs = await Pack.find({});
    res.json(packs);
  } catch (error) {
    console.error('Error fetching packs:', error);
    res.status(500).json({ message: 'Error fetching packs', error: error.message });
  }
});

// POST endpoint for creating a new pack
router.post('/add', requireAdmin, async (req, res) => {
  try {
    const newPack = new Pack(req.body);
    const savedPack = await newPack.save();
    res.status(201).json(savedPack);
  } catch (error) {
    console.error('Error creating new pack:', error);
    res.status(500).json({ message: 'Error creating new pack', error: error.message });
  }
});

// PUT endpoint for updating an existing pack
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const updatedPack = await Pack.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPack) {
      return res.status(404).json({ message: 'Pack not found' });
    }
    res.json(updatedPack);
  } catch (error) {
    console.error('Error updating pack:', error);
    res.status(500).json({ message: 'Error updating pack', error: error.message });
  }
});

// DELETE endpoint for removing a pack
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deletedPack = await Pack.findByIdAndRemove(req.params.id);
    if (!deletedPack) {
      return res.status(404).json({ message: 'Pack not found' });
    }
    res.json({ message: 'Pack deleted successfully', deletedPack });
  } catch (error) {
    console.error('Error deleting pack:', error);
    res.status(500).json({ message: 'Error deleting pack', error: error.message });
  }
});

module.exports = router;
