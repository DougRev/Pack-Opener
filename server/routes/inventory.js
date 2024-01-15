const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); // Middleware to validate JWT token
const Card = require('../models/Card');

// Middleware to require login/auth
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

// GET user's inventory
router.get('/', auth, requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('inventory');
    res.json(user.inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error });
  }
});

// POST add a card to user's inventory
router.post('/add', auth, requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const cardId = req.body.cardId; // Expecting cardId in the request body

    if (!user.inventory.includes(cardId)) {
      user.inventory.push(cardId); // Add cardId to the user's inventory
      await user.save();
      res.json({ message: 'Card added to inventory successfully' });
    } else {
      res.status(400).json({ message: 'Card already in inventory' });
    }
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).json({ message: 'Error adding card to inventory', error: error.message });
  }
});


module.exports = router;
