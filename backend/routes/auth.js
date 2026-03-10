const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../firebase');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration Body:', JSON.stringify(req.body, null, 2));
    const { name, email, password, role } = req.body;
    console.log(`Registration attempt for: ${email}`);

    // Check if user already exists
    const usersRef = db.collection('users');
    const existing = await usersRef.where('email', '==', email).limit(1).get();
    if (!existing.empty) {
      console.log(`Registration failed: ${email} already exists.`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = 'customer'; // Enforce customer role for all public signups

    const userData = {
      name,
      email,
      password: hashedPassword,
      role: userRole,
      phone: '',
      location: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await usersRef.add(userData);

    console.log(`User registered successfully: ${email} as ${userRole}`);
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: docRef.id, name, email, role: userRole }
    });
  } catch (err) {
    console.error(`Registration ERROR for ${req.body.email}:`, err.message);
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) return res.status(400).json({ message: 'Wrong email address' });

    const doc = snapshot.docs[0];
    const user = { id: doc.id, ...doc.data() };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET api/auth/dev-admin
// @desc    Quickly create an admin user for dev/testing if none exists
router.get('/dev-admin', async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const adminSnapshot = await usersRef.where('role', '==', 'admin').limit(1).get();

    if (!adminSnapshot.empty) {
      const adminDoc = adminSnapshot.docs[0];
      return res.json({ msg: 'Admin already exists', email: adminDoc.data().email });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = {
      name: 'System Admin',
      email: 'admin@tourify.com',
      password: hashedPassword,
      role: 'admin',
      phone: '',
      location: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await usersRef.add(admin);
    res.json({ msg: 'Admin created!', id: docRef.id, email: admin.email, password: 'admin123' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
