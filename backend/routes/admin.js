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
