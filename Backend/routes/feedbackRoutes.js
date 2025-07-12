const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/', feedbackController.leaveFeedback);
router.get('/:userId', feedbackController.getFeedbackForUser);

module.exports = router;
