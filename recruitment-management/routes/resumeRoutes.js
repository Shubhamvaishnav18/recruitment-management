const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { uploadResume } = require('../controllers/resumeController');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Route for uploading a resume (only accessible to authenticated Applicants)
router.post('/uploadResume', authenticate, upload.single('resume'), uploadResume);

module.exports = router;
