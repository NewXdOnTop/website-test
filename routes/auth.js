const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const {email, password, name} = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({message: 'Email and password are required'});
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({message: 'Password must be at least 6 characters long'});
    }

    // Check if user already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'User already exists'});
    }

    // Create new user
    const user = new User({
      email,
      password,
      name: name || ''
    });

    await user.save();

    // Create session
    req.session.userId = user._id;

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({message: errors.join(', ')});
    }

    res.status(500).json({message: 'Server error during registration'});
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const {email, password, rememberMe} = req.body;

    // Find user
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({message: 'Invalid credentials'});
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({message: 'Invalid credentials'});
    }

    // Create session
    req.session.userId = user._id;

    // Set session duration based on "Remember me"
    if (rememberMe) {
      // Remember me: 30 days
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    } else {
      // Regular session: 1 day
      req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({message: 'Server error during login'});
  }
});

// Check authentication status
router.get('/check-auth', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({isAuthenticated: false});
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.json({isAuthenticated: false});
    }

    res.json({
      isAuthenticated: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({message: 'Server error during auth check'});
  }
});

// Logout user
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({message: 'Could not log out'});
    }
    res.json({message: 'Logged out successfully'});
  });
});

module.exports = router;
