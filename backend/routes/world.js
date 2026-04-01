const express = require('express');
const axios = require('axios');
const router = express.Router();
const { db } = require('../firebase');

// Fetch destinations from Firestore
router.get('/destinations', async (req, res) => {
  try {
    const snapshot = await db.collection('destinations').get();
    const destinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch destinations', error: err.message });
  }
});

// Public planner settings (for the AI planner UI)
router.get('/planner-settings', async (req, res) => {
  try {
    const doc = await db.collection('planner_settings').doc('defaults').get();
    const data = doc.exists ? (doc.data() || {}) : {};

    const multiplier = Number(data.activityCostMultiplier);

    res.json({
      activityCostMultiplier: Number.isFinite(multiplier) && multiplier > 0 ? multiplier : 100,
      updatedAt: data.updatedAt || null,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch planner settings', error: err.message });
  }
});

// Fetch trails from Firestore
router.get('/trails', async (req, res) => {
  try {
    const snapshot = await db.collection('trails').orderBy('createdAt', 'desc').get();
    const trails = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(trails);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trails', error: err.message });
  }
});

// Example: Demo trips endpoint (static for now)
router.get('/trips', (req, res) => {
  res.json([
    { id: 1, name: 'European Explorer', countries: ['FR', 'DE', 'IT'], price: 1200 },
    { id: 2, name: 'Asian Adventure', countries: ['JP', 'TH', 'VN'], price: 1500 },
    { id: 3, name: 'American Roadtrip', countries: ['US', 'CA', 'MX'], price: 1800 },
  ]);
});

module.exports = router;
