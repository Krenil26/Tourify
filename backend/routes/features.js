const express = require('express');
const router = express.Router();
const Feature = require('../models/Feature');

// @route   GET api/features
// @desc    Get all features
router.get('/', async (req, res) => {
    try {
        const features = await Feature.find().sort({ order: 1 });
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

        await Feature.deleteMany();
        const features = await Feature.insertMany(initialFeatures);
        res.json(features);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
