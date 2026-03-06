const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// @route   GET api/nature-guard
// @desc    Get nature guard data (simulated weather + ecosystem health) for all destinations
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('destinations').get();
        const destinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Simulate real-time ecosystem & weather data for each destination
        const guardData = destinations.map(dest => {
            const lat = dest.coordinates?.lat || 0;
            const lng = dest.coordinates?.lng || 0;

            // Deterministic but varied simulation based on coordinates
            const seed = Math.abs(lat + lng);
            const tempBase = Math.round(15 + (seed % 20));
            const humidity = Math.round(40 + (seed % 40));
            const airQualityIndex = Math.round(20 + (seed % 80));
            const wildlifeSafetyScore = Math.round(70 + (seed % 30));
            const trailCondition = ['Excellent', 'Good', 'Fair', 'Caution'][Math.floor(seed % 4)];
            const weatherCondition = ['Sunny', 'Partly Cloudy', 'Clear', 'Mild Wind', 'Overcast'][Math.floor(seed % 5)];
            const ecosystemStatus = airQualityIndex < 50 ? 'Thriving' : airQualityIndex < 80 ? 'Stable' : 'Stressed';
            const alertLevel = airQualityIndex > 75 ? 'Moderate' : wildlifeSafetyScore < 80 ? 'Low' : 'Clear';

            return {
                id: dest.id,
                name: dest.name,
                country: dest.country,
                category: dest.category,
                coordinates: dest.coordinates,
                weather: {
                    condition: weatherCondition,
                    tempC: tempBase,
                    tempF: Math.round(tempBase * 9 / 5 + 32),
                    humidity: humidity,
                    windKmh: Math.round(5 + (seed % 25)),
                    visibilityKm: Math.round(10 + (seed % 20)),
                },
                ecosystem: {
                    airQualityIndex,
                    airQualityLabel: airQualityIndex < 50 ? 'Good' : airQualityIndex < 100 ? 'Moderate' : 'Unhealthy',
                    status: ecosystemStatus,
                    wildlifeSafetyScore,
                    trailCondition,
                },
                alert: {
                    level: alertLevel,
                    message: alertLevel === 'Moderate' ? 'Air quality may affect sensitive travelers. Take precautions.' :
                        alertLevel === 'Low' ? 'Some wildlife activity reported. Stay on marked trails.' :
                            'Safe for exploration. Ideal conditions.',
                },
                lastUpdated: new Date().toISOString(),
            };
        });

        res.json(guardData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/nature-guard/:id
// @desc    Get nature guard data for a single destination
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('destinations').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ msg: 'Destination not found' });

        const dest = { id: doc.id, ...doc.data() };
        const lat = dest.coordinates?.lat || 0;
        const lng = dest.coordinates?.lng || 0;
        const seed = Math.abs(lat + lng);
        const tempBase = Math.round(15 + (seed % 20));
        const airQualityIndex = Math.round(20 + (seed % 80));

        res.json({
            id: dest.id,
            name: dest.name,
            country: dest.country,
            weather: {
                condition: ['Sunny', 'Partly Cloudy', 'Clear'][Math.floor(seed % 3)],
                tempC: tempBase,
                humidity: Math.round(40 + (seed % 40)),
            },
            ecosystem: {
                airQualityIndex,
                airQualityLabel: airQualityIndex < 50 ? 'Good' : 'Moderate',
                status: airQualityIndex < 60 ? 'Thriving' : 'Stable',
            },
            lastUpdated: new Date().toISOString(),
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
