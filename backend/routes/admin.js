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

// ==================== DESTINATION MANAGEMENT ====================

// @route   GET api/admin/destinations
// @desc    Get all destinations (admin view with status)
// @access  Private/Admin
router.get('/destinations', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const snapshot = await db.collection('destinations').orderBy('createdAt', 'desc').get();
        const destinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(destinations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/destinations
// @desc    Add a new destination (pending approval by default)
// @access  Private/Admin
router.post('/destinations', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, country, category, price, description, image, tags, bestTime, coordinates } = req.body;
        if (!name || !country) {
            return res.status(400).json({ msg: 'Name and country are required' });
        }

        const destinationData = {
            name,
            country,
            category: category || 'General',
            price: Number(price) || 0,
            description: description || '',
            image: image || '',
            tags: tags || [],
            bestTime: bestTime || '',
            coordinates: coordinates || null,
            rating: 0,
            reviews: 0,
            status: 'pending',
            addedBy: req.user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await db.collection('destinations').add(destinationData);
        res.status(201).json({ id: docRef.id, ...destinationData });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/destinations/:id
// @desc    Edit a destination
// @access  Private/Admin
router.put('/destinations/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const ref = db.collection('destinations').doc(req.params.id);
        const doc = await ref.get();
        if (!doc.exists) return res.status(404).json({ msg: 'Destination not found' });

        const { name, country, category, price, description, image, tags, bestTime, coordinates } = req.body;
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (country !== undefined) updates.country = country;
        if (category !== undefined) updates.category = category;
        if (price !== undefined) updates.price = Number(price);
        if (description !== undefined) updates.description = description;
        if (image !== undefined) updates.image = image;
        if (tags !== undefined) updates.tags = tags;
        if (bestTime !== undefined) updates.bestTime = bestTime;
        if (coordinates !== undefined) updates.coordinates = coordinates;
        updates.updatedAt = new Date().toISOString();

        await ref.update(updates);
        const updatedDoc = await ref.get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/destinations/:id/approval
// @desc    Approve or reject a destination
// @access  Private/Admin
router.put('/destinations/:id/approval', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ msg: 'Status must be approved or rejected' });
        }

        const ref = db.collection('destinations').doc(req.params.id);
        const doc = await ref.get();
        if (!doc.exists) return res.status(404).json({ msg: 'Destination not found' });

        await ref.update({
            status,
            approvedBy: req.user.id,
            approvalDate: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        const updatedDoc = await ref.get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
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
        if (!doc.exists) return res.status(404).json({ msg: 'Destination not found' });

        await ref.delete();
        res.json({ msg: 'Destination removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
