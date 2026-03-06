const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// Get all notifications
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('notifications').orderBy('createdAt', 'desc').get();
        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
    try {
        const ref = db.collection('notifications').doc(req.params.id);
        await ref.update({ isRead: true });
        const doc = await ref.get();
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
