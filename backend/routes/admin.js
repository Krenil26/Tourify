const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

function getLanguagesForCountry(country) {
    const map = {
        'India': ['Hindi', 'English'],
        'Nepal': ['Nepali', 'English'],
        'Brazil': ['Portuguese', 'English'],
        'Peru': ['Spanish', 'English'],
        'Bolivia': ['Spanish', 'English'],
        'Colombia': ['Spanish', 'English'],
        'Chile': ['Spanish', 'English'],
        'Argentina': ['Spanish', 'English'],
        'Ecuador': ['Spanish', 'English'],
        'Tanzania': ['Swahili', 'English'],
        'Kenya': ['Swahili', 'English'],
        'Uganda': ['Swahili', 'English'],
        'Indonesia': ['Indonesian', 'English'],
        'Costa Rica': ['Spanish', 'English'],
        'Norway': ['Norwegian', 'English'],
        'Iceland': ['Icelandic', 'English'],
        'Canada': ['English', 'French'],
        'USA': ['English'],
        'Australia': ['English'],
        'New Zealand': ['English'],
        'China': ['Mandarin', 'English'],
        'Japan': ['Japanese', 'English'],
        'Thailand': ['Thai', 'English'],
        'Myanmar': ['Burmese', 'English'],
        'Pakistan': ['Urdu', 'English'],
        'Bhutan': ['Dzongkha', 'English'],
    };
    return map[country] || ['English'];
}

function getFirstAidGuideCount(category) {
    if (category === 'Marine' || category === 'Coastal' || category === 'Island') {
        return 9;
    }
    return 8;
}

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

// @route   GET api/admin/users/:id/details
// @desc    Get a user's full details for admin (profile + bookings)
// @access  Private/Admin
router.get('/users/:id/details', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const userData = userDoc.data() || {};
        delete userData.password;

        const bookingsSnap = await db.collection('bookings')
            .where('userId', '==', userId)
            .get();

        let bookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        bookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        const summary = {
            total: bookings.length,
            pending: bookings.filter(b => (b.status || 'pending') === 'pending').length,
            approved: bookings.filter(b => b.status === 'approved').length,
            rejected: bookings.filter(b => b.status === 'rejected').length,
            cancelled: bookings.filter(b => b.status === 'cancelled').length,
            totalCost: bookings.reduce((sum, b) => sum + (Number(b.totalCost) || 0), 0),
            lastBookingAt: bookings[0]?.createdAt || null,
        };

        res.json({
            user: { id: userDoc.id, ...userData },
            bookings,
            summary,
        });
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
        const adminDoc = await db.collection('users').doc(req.user.id).get();
        const adminData = adminDoc.exists ? adminDoc.data() : {};
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
            createdBy: {
                id: req.user.id,
                name: adminData.name || 'Admin',
                email: adminData.email || '',
            },
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

// @route   PUT api/admin/destinations/:id
// @desc    Update a destination (admin)
// @access  Private/Admin
router.put('/destinations/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const ref = db.collection('destinations').doc(req.params.id);
        const doc = await ref.get();
        if (!doc.exists) {
            return res.status(404).json({ msg: 'Destination not found' });
        }

        const allowed = ['name', 'country', 'image', 'price', 'category', 'description', 'rating', 'tags', 'bestTime', 'itinerary'];
        const updates = {};

        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        if (updates.price !== undefined) updates.price = Number(updates.price);
        if (updates.rating !== undefined) updates.rating = Number(updates.rating);

        // Basic itinerary sanity: ensure it's an array if provided
        if (updates.itinerary !== undefined && !Array.isArray(updates.itinerary)) {
            return res.status(400).json({ msg: 'Invalid itinerary format' });
        }

        const adminDoc = await db.collection('users').doc(req.user.id).get();
        const adminData = adminDoc.exists ? adminDoc.data() : {};

        updates.updatedAt = new Date().toISOString();
        updates.updatedBy = {
            id: req.user.id,
            name: adminData.name || 'Admin',
            email: adminData.email || '',
        };

        await ref.update(updates);
        const updatedDoc = await ref.get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/planner-settings
// @desc    Get planner settings (admin)
// @access  Private/Admin
router.get('/planner-settings', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const doc = await db.collection('planner_settings').doc('defaults').get();
        const data = doc.exists ? (doc.data() || {}) : {};
        const multiplier = Number(data.activityCostMultiplier);

        res.json({
            activityCostMultiplier: Number.isFinite(multiplier) && multiplier > 0 ? multiplier : 100,
            updatedAt: data.updatedAt || null,
            updatedBy: data.updatedBy || null,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/planner-settings
// @desc    Update planner settings (admin)
// @access  Private/Admin
router.put('/planner-settings', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { activityCostMultiplier } = req.body;
        const multiplier = Number(activityCostMultiplier);

        if (!Number.isFinite(multiplier) || multiplier <= 0 || multiplier > 100000) {
            return res.status(400).json({ msg: 'activityCostMultiplier must be a number between 1 and 100000' });
        }

        const adminDoc = await db.collection('users').doc(req.user.id).get();
        const adminData = adminDoc.exists ? adminDoc.data() : {};

        const payload = {
            activityCostMultiplier: multiplier,
            updatedAt: new Date().toISOString(),
            updatedBy: {
                id: req.user.id,
                name: adminData.name || 'Admin',
                email: adminData.email || '',
            },
        };

        await db.collection('planner_settings').doc('defaults').set(payload, { merge: true });

        res.json(payload);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/offline-packs
// @desc    Get all offline pack controls for admin
// @access  Private/Admin
router.get('/offline-packs', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [destinationsSnap, settingsSnap] = await Promise.all([
            db.collection('destinations').get(),
            db.collection('offline_pack_settings').get(),
        ]);

        const settingsMap = {};
        settingsSnap.docs.forEach((doc) => {
            settingsMap[doc.id] = doc.data();
        });

        const packs = destinationsSnap.docs.map((doc) => {
            const data = doc.data();
            const setting = settingsMap[doc.id] || {};
            const seed = Math.abs((data.coordinates?.lat || 20) + (data.coordinates?.lng || 70));
            const defaultSize = Math.round(80 + (seed % 120));
            const languages = getLanguagesForCountry(data.country);

            return {
                id: doc.id,
                name: data.name,
                country: data.country,
                category: data.category,
                image: data.image || '',
                packVersion: setting.packVersion || '1.2.0',
                packSizeMB: Number(setting.packSizeMB) || defaultSize,
                enabled: setting.enabled !== false,
                isPublic: setting.isPublic !== false,
                languagesCount: languages.length,
                firstAidGuideCount: getFirstAidGuideCount(data.category),
                updatedAt: setting.updatedAt || null,
                updatedBy: setting.updatedBy || null,
            };
        });

        const summary = {
            total: packs.length,
            enabled: packs.filter((p) => p.enabled).length,
            publicCount: packs.filter((p) => p.isPublic).length,
            disabled: packs.filter((p) => !p.enabled).length,
            privateCount: packs.filter((p) => !p.isPublic).length,
        };

        res.json({ summary, packs });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/offline-packs/:id
// @desc    Update offline pack access/settings for destination
// @access  Private/Admin
router.put('/offline-packs/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { enabled, isPublic, packVersion, packSizeMB } = req.body;
        const destinationId = req.params.id;

        const destinationRef = db.collection('destinations').doc(destinationId);
        const destinationDoc = await destinationRef.get();
        if (!destinationDoc.exists) {
            return res.status(404).json({ msg: 'Destination not found' });
        }

        const updates = {
            updatedAt: new Date().toISOString(),
            updatedBy: req.user?.email || req.user?.id || 'admin',
        };

        if (enabled !== undefined) updates.enabled = !!enabled;
        if (isPublic !== undefined) updates.isPublic = !!isPublic;
        if (packVersion !== undefined) updates.packVersion = String(packVersion).trim() || '1.2.0';
        if (packSizeMB !== undefined) {
            const size = Number(packSizeMB);
            if (Number.isNaN(size) || size < 20 || size > 500) {
                return res.status(400).json({ msg: 'packSizeMB must be a number between 20 and 500' });
            }
            updates.packSizeMB = size;
        }

        await db.collection('offline_pack_settings').doc(destinationId).set(updates, { merge: true });

        const updatedSettingDoc = await db.collection('offline_pack_settings').doc(destinationId).get();
        res.json({ id: destinationId, ...updatedSettingDoc.data() });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
