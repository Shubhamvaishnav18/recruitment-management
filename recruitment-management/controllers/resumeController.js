const axios = require('axios');
const multer = require('multer');
const Profile = require('../models/profileModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// File filter to allow only PDF and DOCX formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Upload and process resume function
exports.uploadResume = [
  upload.single('resume'), // Multer middleware to handle file upload
  async (req, res) => {
    try {
      // Check if the user is an Applicant
      if (req.user.userType !== 'Applicant') {
        return res.status(403).json({ error: 'Access denied. Only applicants can upload resumes.' });
      }

      const filePath = req.file.path;

      // Read the resume file as a binary buffer
      const fileBuffer = fs.readFileSync(filePath);

      // Send the resume to the third-party API for processing
      const apiResponse = await axios.post(
        'https://api.apilayer.com/resume_parser/upload',
        fileBuffer,
        {
          headers: {
            'Content-Type': 'application/octet-stream',
            'apikey': process.env.RESUME_PARSER_API_KEY, // Make sure to set this in your .env file
          }
        }
      );

      // Extract the necessary data from the API response
      const { skills, education, experience, name, email, phone } = apiResponse.data;

      // Create or update the user's profile with the extracted data
      const profileData = {
        applicant: req.user._id,
        resumeFileAddress: filePath,
        skills: skills.join(', '),
        education: education.join(', '),
        experience: experience.join(', '),
        name,
        email,
        phone
      };

      const profile = await Profile.findOneAndUpdate(
        { applicant: req.user._id },
        profileData,
        { new: true, upsert: true }
      );

      res.status(200).json({ message: 'Resume uploaded and processed successfully', profile });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload and process resume', details: error.message });
    }
  }
];
