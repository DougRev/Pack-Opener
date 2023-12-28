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
    // Find the user by ID added to req by the auth middleware
    const user = await User.findById(req.user.id);

    // Create a new card without specifying the _id
    const newCard = new Card({
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      packId: req.body.packId // make sure this is a valid ObjectId or remove if not necessary
    });

    // Save the new card to the database
    const savedCard = await newCard.save();

    // Add the new card to the user's inventory
    user.inventory.push(savedCard._id); // Push the new card's _id to the inventory array
    await user.save(); // Save the user with the updated inventory

    res.status(201).json(savedCard);
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).json({ message: 'Error adding card to inventory', error: error.message });
  }
});

module.exports = router;
