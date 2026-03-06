const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { authMiddleware } = require('../middleware/auth');

// Get profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const doc = await db.collection('users').doc(req.user.id).get();
        if (!doc.exists) return res.status(404).json({ message: 'User not found' });

        const user = doc.data();
        delete user.password;
        res.json({ id: doc.id, ...user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, email, phone, location } = req.body;

        const updates = { updatedAt: new Date().toISOString() };
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (phone) updates.phone = phone;
        if (location) updates.location = location;

        const ref = db.collection('users').doc(req.user.id);
        const doc = await ref.get();
        if (!doc.exists) return res.status(404).json({ message: 'User not found' });

        await ref.update(updates);

        const updatedDoc = await ref.get();
        const user = updatedDoc.data();
        delete user.password;
        res.json({ id: updatedDoc.id, ...user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
