const express = require('express');
const router = express.Router();
const { getTrends, getSources } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/trends', protect, getTrends);
router.get('/sources', protect, getSources);

module.exports = router;
