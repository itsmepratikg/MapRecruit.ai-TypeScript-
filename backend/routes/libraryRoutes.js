const express = require('express');
const router = express.Router();
const {
    getLibraryItems,
    createLibraryItem,
    updateLibraryItem,
    deleteLibraryItem
} = require('../controllers/libraryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getLibraryItems)
    .post(createLibraryItem);

router.route('/:id')
    .put(updateLibraryItem)
    .delete(deleteLibraryItem);

module.exports = router;
