const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register or update profile
router.post('/register', userController.registerUser);

// Get all public profiles (optional skill filter)
router.get('/browse', userController.getPublicProfiles);

module.exports = router;
