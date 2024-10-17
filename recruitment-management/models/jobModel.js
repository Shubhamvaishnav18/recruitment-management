const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  postedOn: { type: Date, default: Date.now },
  totalApplications: { type: Number, default: 0 },
  companyName: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Job', jobSchema);
