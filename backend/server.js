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

// 1. Extreme CORS Fix (Manual headers to bypass potential library issues)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// 2. Health Check / Root (Moved to top)
app.get('/', (req, res) => {
  console.log('✅ Health check hit at root /');
  res.send('Tourify API is ONLINE. v1.0.2');
});

// 3. Detailed Request Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 4. API Routes
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Database: Firebase Firestore');
});
