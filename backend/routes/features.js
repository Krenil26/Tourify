const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// @route   GET api/features
// @desc    Get all features
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('features').orderBy('order', 'asc').get();
        const features = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(features);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/features/seed
// @desc    Seed initial features
router.post('/seed', async (req, res) => {
    try {
        const initialFeatures = [
            {
                title: "Eco-Smart Itineraries",
                description: "Our AI prioritizes sustainable paths and hidden natural sanctuaries tailored to your spirit.",
                iconName: "Leaf",
                className: "col-span-12 md:col-span-8 lg:col-span-6",
                gradient: "from-emerald-500/20 to-emerald-500/5",
                link: "/planner",
                order: 1
            },
            {
                title: "Quiet Trails",
                description: "Discover off-beat paths where technology meets tranquility.",
                iconName: "Compass",
                className: "col-span-12 md:col-span-4 lg:col-span-3",
                gradient: "from-teal-500/20 to-teal-500/5",
                link: "/destinations",
                order: 2
            },
            {
                title: "Nature Guard",
                description: "Real-time updates on weather and ecosystem health to keep your journey safe.",
                iconName: "Cloud",
                className: "col-span-12 md:col-span-4 lg:col-span-3",
                gradient: "from-sky-500/20 to-sky-500/5",
                link: "/nature-guard",
                order: 3
            },
            {
                title: "Global Sanctuary",
                description: "Access over 5,000 protected parks and retreats across the globe.",
                iconName: "Globe",
                className: "col-span-12 md:col-span-4 lg:col-span-3",
                gradient: "from-emerald-600/20 to-emerald-600/5",
                link: "/global-sanctuary",
                order: 4
            },
            {
                title: "Tribal Sync",
                description: "Share your discovery with your fellow explorers in serene digital spaces.",
                iconName: "Users",
                className: "col-span-12 md:col-span-8 lg:col-span-6",
                gradient: "from-amber-500/20 to-amber-500/5",
                link: "/tribal-sync",
                order: 5
            },
            {
                title: "Wildlife Insight",
                description: "Identify flora and fauna along your route with our integrated AI vision.",
                iconName: "Bird",
                className: "col-span-12 md:col-span-4 lg:col-span-3",
                gradient: "from-orange-500/20 to-orange-500/5",
                link: "/wildlife-insight",
                order: 6
            }
        ];

        // Delete all existing features
        const existing = await db.collection('features').get();
        const batch = db.batch();
        existing.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();

        // Insert new features
        const insertBatch = db.batch();
        const refs = initialFeatures.map(() => db.collection('features').doc());
        refs.forEach((ref, i) => insertBatch.set(ref, initialFeatures[i]));
        await insertBatch.commit();

        const snapshot = await db.collection('features').orderBy('order', 'asc').get();
        const features = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(features);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
