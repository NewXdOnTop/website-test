const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({message: 'Authentication required'});
};

// Get user profile
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    res.json({user});
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({message: 'Server error'});
  }
});

// Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const {name} = req.body;

    // Update fields
    const updateData = {};
    if (name) updateData.name = name;

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      {$set: updateData},
      {new: true, runValidators: true}
    ).select('-password');

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    res.json({user, message: 'Profile updated successfully'});
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({message: 'Server error'});
  }
});

// Change password
router.put('/change-password', isAuthenticated, async (req, res) => {
  try {
    const {currentPassword, newPassword} = req.body;

    // Find user
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({message: 'Current password is incorrect'});
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({message: 'Password changed successfully'});
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({message: 'Server error'});
  }
});

module.exports = router;
