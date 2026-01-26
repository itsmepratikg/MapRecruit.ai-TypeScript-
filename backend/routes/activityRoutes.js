const express = require('express');
const router = express.Namespace ? express.Namespace() : express.Router();
const { getActivities, logActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getActivities);
router.post('/', protect, logActivity);

module.exports = router;
