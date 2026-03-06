const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { authMiddleware } = require('../middleware/auth');

// @route   GET api/customer/profile
// @desc    Get logged in customer profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const doc = await db.collection('users').doc(req.user.id).get();
        if (!doc.exists) return res.status(404).json({ msg: 'User not found' });

        const user = doc.data();
        delete user.password;
        res.json({ id: doc.id, ...user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/customer/profile
// @desc    Update customer profile details
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, phone, location } = req.body;

        const updates = { updatedAt: new Date().toISOString() };
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (location) updates.location = location;

        const ref = db.collection('users').doc(req.user.id);
        await ref.update(updates);

        const updatedDoc = await ref.get();
        if (!updatedDoc.exists) return res.status(404).json({ msg: 'User not found' });

        const user = updatedDoc.data();
        delete user.password;
        res.json({ id: updatedDoc.id, ...user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
