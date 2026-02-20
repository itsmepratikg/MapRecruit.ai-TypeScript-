const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Unified Upload Endpoint
// Handled by middleware: if multipart, req.file is populated. If JSON, body is populated.
router.post('/', uploadController.uploadMiddleware, uploadController.handleUpload);

module.exports = router;
