const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resumeFileAddress: String,
  skills: String,
  education: String,
  experience: String,
  phone: String,
});

module.exports = mongoose.model('Profile', profileSchema);
