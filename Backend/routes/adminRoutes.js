const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');

// Admin-only routes
router.patch('/ban/:userId', protect, requireAdmin, adminController.banUser);
router.patch('/unban/:userId', protect, requireAdmin, adminController.unbanUser);
router.get('/banned-users', protect, requireAdmin, adminController.getBannedUsers);
router.get('/stats/swaps', protect, requireAdmin, adminController.getSwapStats);

module.exports = router;
