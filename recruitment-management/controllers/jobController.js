const Job = require('../models/jobModel');
const User = require('../models/userModel');

// Create a new job posting (Admin only)
exports.createJob = async (req, res) => {
  try {
    // Check if the user is an Admin
    if (req.user.userType !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Only admins can create job postings.' });
    }

    const { title, description, companyName } = req.body;
    const job = new Job({
      title,
      description,
      companyName,
      postedBy: req.user._id,
    });

    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job', details: error.message });
  }
};

// Get job details and list of applicants for a specific job (Admin only)
exports.getJobDetails = async (req, res) => {
  try {
    if (req.user.userType !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Only admins can view job details.' });
    }

    const jobId = req.params.job_id;
    const job = await Job.findById(jobId).populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Assume you have a function getApplicantsByJobId (this would query the database for applicants)
    const applicants = await User.find({ appliedJobs: jobId }).select('name email profileHeadline');

    res.status(200).json({ job, applicants });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job details', details: error.message });
  }
};

// Get all job postings (accessible to all users)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name companyName');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job openings', details: error.message });
  }
};

// Apply to a job (Applicant only)
exports.applyToJob = async (req, res) => {
  try {
    if (req.user.userType !== 'Applicant') {
      return res.status(403).json({ error: 'Access denied. Only applicants can apply for jobs.' });
    }

    const jobId = req.query.job_id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Add the user to the job's list of applicants
    job.totalApplications += 1;
    await job.save();

    // Optionally, you could save this application reference in the user profile as well
    req.user.appliedJobs = req.user.appliedJobs || [];
    req.user.appliedJobs.push(jobId);
    await req.user.save();

    res.status(200).json({ message: 'Successfully applied for the job', job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply for the job', details: error.message });
  }
};

// Get all applicants (Admin only)
exports.getAllApplicants = async (req, res) => {
  try {
    if (req.user.userType !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Only admins can view applicants.' });
    }

    const applicants = await User.find({ userType: 'Applicant' }).select('name email profileHeadline');
    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applicants', details: error.message });
  }
};

// Get details of a specific applicant (Admin only)
exports.getApplicantDetails = async (req, res) => {
  try {
    if (req.user.userType !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Only admins can view applicant details.' });
    }

    const applicantId = req.params.applicant_id;
    const applicant = await User.findById(applicantId).select('name email address profileHeadline');
    const profile = await Profile.findOne({ applicant: applicantId });

    if (!applicant || !profile) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    res.status(200).json({ applicant, profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applicant details', details: error.message });
  }
};
