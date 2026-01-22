const express = require('express');
const router = express.Router();
const { getClients, getClientById } = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getClients);
router.get('/:id', protect, getClientById);

module.exports = router;
