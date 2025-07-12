const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');

router.post('/request', swapController.requestSwap);
router.get('/:userId', swapController.getUserSwaps);
router.patch('/:id', swapController.updateSwapStatus);

module.exports = router;
