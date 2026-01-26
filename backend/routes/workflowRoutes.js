const express = require('express');
const router = express.Namespace ? express.Namespace() : express.Router();
const { getWorkflow, saveWorkflow } = require('../controllers/workflowController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:campaignId', protect, getWorkflow);
router.post('/', protect, saveWorkflow);

module.exports = router;
