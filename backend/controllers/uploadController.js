const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- Multer Config ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // preserve extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- Controller Actions ---
exports.uploadMiddleware = upload.single('file'); // 'file' is the field name from Gmail

// Handle Multipart (Gmail) OR JSON Base64 (Outlook)
exports.handleUpload = async (req, res) => {
    try {
        let filePath;
        let originalName;

        // A. Multipart (Gmail)
        if (req.file) {
            console.log('Received Multipart File:', req.file);
            filePath = req.file.path;
            originalName = req.file.originalname;
        }
        // B. JSON Base64 (Outlook)
        else if (req.body.fileData && req.body.fileName) {
            console.log('Received Base64 File:', req.body.fileName);
            originalName = req.body.fileName;

            const buffer = Buffer.from(req.body.fileData, 'base64');
            const uniqueName = `outlook-${Date.now()}-${originalName}`;
            const uploadDir = path.join(__dirname, '../uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            filePath = path.join(uploadDir, uniqueName);
            fs.writeFileSync(filePath, buffer);
        } else {
            return res.status(400).json({ error: 'No file provided' });
        }

        // TODO: Process the file (e.g. parse resume, add to candidate DB)
        // For now, just confirming receipt

        res.status(200).json({
            message: 'File uploaded successfully',
            fileName: originalName,
            storedPath: filePath
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
};
