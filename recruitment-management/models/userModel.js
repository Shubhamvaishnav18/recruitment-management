const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  address: String,
  userType: { type: String, enum: ['Admin', 'Applicant'], required: true },
  passwordHash: String,
  profileHeadline: String,
});

module.exports = mongoose.model('User', userSchema);
