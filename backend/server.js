const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

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
  origin: [
    process.env.FRONTEND_URL,
    'https://tourifyy.vercel.app',
    'http://localhost:3000'
  ].filter(Boolean), // Filter out undefined values
  credentials: true
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

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tourify', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('Ensure MongoDB is running locally on port 27017');
    // Do not exit process, so the server can still run (though API might fail)
    // process.exit(1); 
  }
};

connectDB();

// Basic Route
app.get('/', (req, res) => {
  res.send('Tourify Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
