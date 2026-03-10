const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route   GET api/admin/stats
// @desc    Get dashboard statistics for admin
// @access  Private/Admin
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const usersRef = db.collection('users');
        const notificationsRef = db.collection('notifications');

        const [allUsers, customers, admins, alertNotifs] = await Promise.all([
            usersRef.get(),
            usersRef.where('role', '==', 'customer').get(),
            usersRef.where('role', '==', 'admin').get(),
            notificationsRef.where('type', '==', 'alert').get(),
        ]);

        res.json({
            userCount: allUsers.size,
            customerCount: customers.size,
            adminCount: admins.size,
            activeAlerts: alertNotifs.size,
            systemStatus: 'Online',
            certifications: 342 // Mock data from dashboard
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users
// @desc    Get all users for admin management
// @access  Private/Admin
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            delete data.password;
            return { id: doc.id, ...data };
        });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const ref = db.collection('users').doc(req.params.id);
        const doc = await ref.get();
        if (!doc.exists) {
            return res.status(404).json({ msg: 'User not found' });
        }
        await ref.delete();
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/users/:id/role
// @desc    Update a user's role
// @access  Private/Admin
router.put('/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['admin', 'customer'].includes(role)) {
            return res.status(400).json({ msg: 'Invalid role' });
        }

        const ref = db.collection('users').doc(req.params.id);
        const doc = await ref.get();
        if (!doc.exists) return res.status(404).json({ msg: 'User not found' });

        await ref.update({ role, updatedAt: new Date().toISOString() });

        const updatedDoc = await ref.get();
        const user = updatedDoc.data();
        delete user.password;
        res.json({ id: updatedDoc.id, ...user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/destinations
// @desc    Get all destinations for admin
// @access  Private/Admin
router.get('/destinations', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const snapshot = await db.collection('destinations').get();
        const destinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(destinations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/destinations
// @desc    Add a new destination
// @access  Private/Admin
router.post('/destinations', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, country, image, price, category, description, rating, tags, bestTime } = req.body;
        if (!name || !country || !price || !category) {
            return res.status(400).json({ msg: 'Name, country, price and category are required' });
        }
        const destination = {
            name,
            country,
            image: image || '',
            price: Number(price),
            category,
            description: description || '',
            rating: Number(rating) || 4.5,
            reviews: 0,
            tags: tags || [],
            bestTime: bestTime || '',
            natureFocus: true,
            createdAt: new Date().toISOString(),
        };
        const docRef = await db.collection('destinations').add(destination);
        res.status(201).json({ id: docRef.id, ...destination });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/destinations/:id
// @desc    Delete a destination
// @access  Private/Admin
router.delete('/destinations/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const ref = db.collection('destinations').doc(req.params.id);
        const doc = await ref.get();
        if (!doc.exists) {
            return res.status(404).json({ msg: 'Destination not found' });
        }
        await ref.delete();
        res.json({ msg: 'Destination removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
