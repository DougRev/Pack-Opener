const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary
const auth = require('../middleware/auth'); // Adjust the path to where your auth middleware is located
const admin = require('../middleware/admin'); // Adjust the path to where

// Register endpoint
router.post('/register', async (req, res) => {
    const { username, password, isAdmin } = req.body; // Include isAdmin in the request if needed

    if (password === undefined || password === '') {
        return res.status(400).json({ message: "Password is required" });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // Add the isAdmin flag to the user document
        const newUser = new User({
            username,
            password: hashedPassword,
            isAdmin: isAdmin || false // Default to false if isAdmin is not provided
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ message: "Error registering new user", error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log(user);
        // Include the isAdmin flag in the token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin, username: user.username},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
});

router.put('/make-admin/:userId', [auth, admin], async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { isAdmin: true },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User updated to admin', user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  });

module.exports = router;
