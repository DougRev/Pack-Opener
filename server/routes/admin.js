const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Card = require('../models/Card');
const Pack = require('../models/Pack');

// Middleware for admin routes
const requireAdmin = [auth, admin];

// Make user an admin
router.post('/make-admin/:userId', [auth, admin], async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, { isAdmin: true }, { new: true });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error promoting user to admin', error: error.message });
    }
  });
  

// List all cards
router.get('/cards', requireAdmin, async (req, res) => {
  try {
    const cards = await Card.find({});
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cards', error: error.message });
  }
});

// Create a new card
router.post('/cards', requireAdmin, async (req, res) => {
  try {
    const newCard = new Card(req.body);
    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (error) {
    res.status(500).json({ message: 'Error creating card', error: error.message });
  }
});

// Update an existing card
router.put('/cards/:id', requireAdmin, async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating card', error: error.message });
  }
});

// Delete a card
router.delete('/cards/:id', requireAdmin, async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);
    res.json({ message: 'Card deleted successfully', deletedCard });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting card', error: error.message });
  }
});

// List all packs
router.get('/packs', requireAdmin, async (req, res) => {
  try {
    const packs = await Pack.find({});
    res.json(packs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packs', error: error.message });
  }
});

// Create a new pack
router.post('/packs', requireAdmin, async (req, res) => {
  try {
    const newPack = new Pack(req.body);
    const savedPack = await newPack.save();
    res.status(201).json(savedPack);
  } catch (error) {
    res.status(500).json({ message: 'Error creating pack', error: error.message });
  }
});

// Update an existing pack
router.put('/packs/:id', requireAdmin, async (req, res) => {
  try {
    const updatedPack = await Pack.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPack);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pack', error: error.message });
  }
});

// Delete a pack
router.delete('/packs/:id', requireAdmin, async (req, res) => {
  try {
    const deletedPack = await Pack.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pack deleted successfully', deletedPack });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pack', error: error.message });
  }
});

module.exports = router;
