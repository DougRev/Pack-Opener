const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Card = require('../models/Card');
const Pack = require('../models/Pack');
const RarityDistribution = require('../models/RarityDistribution'); // Import the model

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

// Create a new pack with a selected rarity distribution template
router.post('/packs', requireAdmin, async (req, res) => {
  try {
    const { name, description, imageUrl, rarityDistribution } = req.body;
    
    // Find the template by name
    const distribution = await RarityDistribution.findOne({ name: rarityDistribution });
    if (!distribution) {
      return res.status(404).json({ message: 'Rarity distribution template not found' });
    }
    
    const newPack = new Pack({
      name,
      description,
      imageUrl,
      rarityDistribution: distribution.rarityDistribution
    });
    
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

// Endpoint to create/update a pack with a selected rarity distribution template
router.post('/packs', auth, async (req, res) => {
  const { name, description, imageUrl, rarityDistribution } = req.body;

  // Find the template with the given name
  const rarityTemplate = await RarityDistribution.findOne({ name: rarityDistribution });

  if (!rarityTemplate) {
    return res.status(404).json({ message: 'Rarity distribution template not found' });
  }

  // Create a new pack with the template's rarity distribution
  const newPack = new Pack({
    name,
    description,
    imageUrl,
    rarityDistribution: rarityTemplate.rarityDistribution
  });

  // ... Save the pack and return the response ...
});

// POST endpoint to create a new rarity distribution template
router.post('/rarity-distributions', requireAdmin, async (req, res) => {
  try {
    const newDistribution = new RarityDistribution(req.body);
    const savedDistribution = await newDistribution.save();
    res.status(201).json(savedDistribution);
  } catch (error) {
    res.status(500).json({ message: 'Error creating rarity distribution', error: error.message });
  }
});

// GET endpoint to list all rarity distributions
router.get('/rarity-distributions', requireAdmin ,async (req, res) => {
  try {
    const distributions = await RarityDistribution.find({});
    res.json(distributions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rarity distributions', error: error.message });
  }
});

// ...additional CRUD operations for rarity distributions...

module.exports = router;
