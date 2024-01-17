const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path according to your project structure
const auth = require('../middleware/auth');


// GET endpoint to fetch user's currency
router.get('/currency', auth, async (req, res) => {
    try {
      const userId = req.user.id; // Get the user id from the auth middleware
      const user = await User.findById(userId).select('currency'); // Select only the currency field
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ currency: user.currency });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user currency', error: error.message });
    }
});
    

router.get('/profile', auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('-password'); // Exclude the password
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
});

router.put('/profile', auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const update = req.body;
      const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
});

router.get('/inventory', auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate('inventory');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ inventory: user.inventory });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user inventory', error: error.message });
    }
});


router.put('/change-password', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Validate the current password, then update to the new password
    // Remember to hash the new password before saving

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});

router.delete('/delete-account', auth, async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Perform any cleanup needed, such as removing user data, before deleting the account
  
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting account', error: error.message });
    }
});  

module.exports = router;
