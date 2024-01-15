const express = require('express');
const router = express.Router();
const Pack = require('../models/Pack');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); 
const { selectRandomRarity } = require('../utils/packUtils');
const CardTemplate = require('../models/CardTemplate'); 
const Card = require('../models/Card');
const { selectCardsBasedOnRarity } = require('../utils/packUtils');
const User = require('../models/User'); 

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
router.post('/', requireAdmin, async (req, res) => {
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
    const deletedPack = await Pack.findByIdAndDelete(req.params.id);
    if (!deletedPack) {
      return res.status(404).json({ message: 'Pack not found' });
    }
    res.json({ message: 'Pack deleted successfully' });
  } catch (error) {
    console.error('Error deleting pack:', error);
    res.status(500).json({ message: 'Error deleting pack', error: error.message });
  }
});

// POST endpoint for opening a pack
router.post('/open/:packId', auth, async (req, res) => {
  try {
    const { packId } = req.params;
    const pack = await Pack.findById(packId);
    if (!pack) {
      return res.status(404).json({ message: 'Pack not found' });
    }

    // Select cards based on rarity distribution
    const selectedCards = await selectCardsBasedOnRarity(pack);

    // Assuming that cards are now directly added to the user's inventory
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.inventory.push(...selectedCards.map(card => card._id));
    await user.save();

    res.status(200).json({
      message: 'Pack opened and cards added to inventory',
      cards: selectedCards
    });
  } catch (error) {
    console.error('Error opening pack:', error);
    res.status(500).json({ message: 'Error opening pack', error: error.toString() });
  }
});





module.exports = router;
