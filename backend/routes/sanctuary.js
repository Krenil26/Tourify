const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// @route   GET api/sanctuary
// @desc    Get all sanctuary destinations grouped by region/continent
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('destinations').get();
        const destinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Group by continent based on country
        const continentMap = {
            'USA': 'North America', 'Canada': 'North America', 'Mexico': 'North America',
            'Peru': 'South America', 'Brazil': 'South America',
            'India': 'Asia', 'Japan': 'Asia', 'Maldives': 'Asia',
            'Greece': 'Europe', 'Italy': 'Europe', 'France': 'Europe', 'Germany': 'Europe',
            'Tanzania': 'Africa', 'Kenya': 'Africa', 'South Africa': 'Africa',
            'Australia': 'Oceania', 'New Zealand': 'Oceania',
        };

        const stats = {
            total: destinations.length,
            protected: destinations.filter(d => d.natureFocus).length,
            countries: [...new Set(destinations.map(d => d.country))].length,
            categories: [...new Set(destinations.map(d => d.category))],
        };

        // Group destinations by continent
        const grouped = destinations.reduce((acc, dest) => {
            const continent = continentMap[dest.country] || 'Other';
            if (!acc[continent]) acc[continent] = [];
            acc[continent].push({
                id: dest.id,
                name: dest.name,
                country: dest.country,
                image: dest.image,
                rating: dest.rating,
                price: dest.price,
                category: dest.category,
                tags: dest.tags,
                bestTime: dest.bestTime,
                natureFocus: dest.natureFocus,
                coordinates: dest.coordinates,
                description: dest.description,
            });
            return acc;
        }, {});

        res.json({ stats, grouped, all: destinations });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/sanctuary/category/:cat
// @desc    Get destinations filtered by category
router.get('/category/:cat', async (req, res) => {
    try {
        const cat = req.params.cat.toLowerCase();
        const snapshot = await db.collection('destinations').get();
        const destinations = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(d => (d.category || '').toLowerCase().includes(cat));
        res.json(destinations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
