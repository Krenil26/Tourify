const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { authMiddleware } = require('../middleware/auth');

// Get latest feedback (public)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db
      .collection('feedback')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const feedback = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add feedback (auth required)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, rating } = req.body;

    const normalizedContent = typeof content === 'string' ? content.trim() : '';
    const parsedRating = Number(rating);

    if (!normalizedContent) {
      return res.status(400).json({ message: 'Feedback content is required.' });
    }

    if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
    }

    // Load user profile for display name
    let displayName = 'Customer';
    try {
      const userDoc = await db.collection('users').doc(req.user.id).get();
      if (userDoc.exists) {
        const data = userDoc.data() || {};
        if (data.name) displayName = data.name;
      }
    } catch {
      // ignore user lookup failures
    }

    const payload = {
      userId: req.user.id,
      name: displayName,
      rating: Math.round(parsedRating),
      content: normalizedContent,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('feedback').add(payload);
    res.status(201).json({ id: docRef.id, ...payload });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
