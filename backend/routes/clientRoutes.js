const express = require('express');
const router = express.Router();
const { getClients, getClientById, updateClient, createClient } = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getClients);
router.post('/', protect, createClient);
router.get('/:id', protect, getClientById);
router.put('/:id', protect, updateClient);

module.exports = router;
