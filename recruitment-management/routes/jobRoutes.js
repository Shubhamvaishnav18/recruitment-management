const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {
  createJob,
  getJobDetails,
  getJobs,
  applyToJob,
  getAllApplicants,
  getApplicantDetails
} = require('../controllers/jobController');

const router = express.Router();

router.post('/admin/job', authenticate, createJob);
router.get('/admin/job/:job_id', authenticate, getJobDetails);
router.get('/jobs', authenticate, getJobs);
router.get('/jobs/apply', authenticate, applyToJob);
router.get('/admin/applicants', authenticate, getAllApplicants);
router.get('/admin/applicant/:applicant_id', authenticate, getApplicantDetails);

module.exports = router;
