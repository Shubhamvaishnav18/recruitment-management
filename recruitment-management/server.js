const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("Connected to DB"));

// Use routes
app.use('/api', authRoutes);
app.use('/api', jobRoutes);
app.use('/api', resumeRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
