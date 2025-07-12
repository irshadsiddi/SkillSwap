const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.patch('/ban/:userId', adminController.banUser);
router.get('/stats/swaps', adminController.getSwapStats);

module.exports = router;
