const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Firebase (must be done before routes are loaded)
const { db } = require('./firebase');

const authRoutes = require('./routes/auth');
const worldRoutes = require('./routes/world');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/user');
const spiritRoutes = require('./routes/spirit');
const featureRoutes = require('./routes/features');
const natureGuardRoutes = require('./routes/nature-guard');
const sanctuaryRoutes = require('./routes/sanctuary');
const tribeRoutes = require('./routes/tribe');
const wildlifeRoutes = require('./routes/wildlife');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/world', worldRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/spirit', spiritRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/nature-guard', natureGuardRoutes);
app.use('/api/sanctuary', sanctuaryRoutes);
app.use('/api/tribe', tribeRoutes);
app.use('/api/wildlife', wildlifeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Tourify Backend is running with Firebase Firestore! 🔥');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Database: Firebase Firestore');
});
