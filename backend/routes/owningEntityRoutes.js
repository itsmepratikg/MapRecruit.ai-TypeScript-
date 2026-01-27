const express = require('express');
const router = express.Router();
const { getByClientId } = require('../controllers/owningEntityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/by-client/:clientId', protect, getByClientId);

module.exports = router;
