const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Register new user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Browse all public profiles (with optional skill filter)
router.get('/browse', userController.getPublicProfiles);

// Get a specific user's profile (with privacy rules)
router.get('/profile/:id', protect, userController.getUserProfile);

// Update logged-in user's profile
router.put('/profile', protect, userController.updateUserProfile);

module.exports = router;
