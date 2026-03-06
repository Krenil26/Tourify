const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// @route   GET api/tribe
// @desc    Get all tribe posts
router.get('/', async (req, res) => {
    try {
        const { category, style, sort } = req.query;
        let query = db.collection('tribePosts');

        if (category && category !== 'All') {
            query = query.where('category', '==', category);
        }
        if (style && style !== 'All') {
            query = query.where('travelStyle', '==', style);
        }

        // Firestore doesn't support multi-field ordering without composite indexes on filtered queries easily
        // So we sort in-memory for flexibility
        const snapshot = await query.get();
        let posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (sort === 'popular') {
            posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else if (sort === 'top') {
            posts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else {
            posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tribe
// @desc    Create a new tribe post
router.post('/', async (req, res) => {
    try {
        const { authorName, destination, country, title, story, tags, category, travelStyle, rating, image, isEcoCertified } = req.body;
        if (!authorName || !destination || !title || !story) {
            return res.status(400).json({ msg: 'Please fill all required fields.' });
        }

        const post = {
            authorName,
            authorAvatar: req.body.authorAvatar || '',
            destination,
            country: country || '',
            image: image || '',
            title,
            story,
            tags: tags || [],
            likes: 0,
            comments: 0,
            category: category || 'Nature',
            isEcoCertified: isEcoCertified || false,
            travelStyle: travelStyle || 'Solo',
            rating: rating || 5.0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await db.collection('tribePosts').add(post);
        res.status(201).json({ id: docRef.id, ...post });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/tribe/:id/like
// @desc    Like a tribe post
router.put('/:id/like', async (req, res) => {
    try {
        const ref = db.collection('tribePosts').doc(req.params.id);
        const doc = await ref.get();
        if (!doc.exists) return res.status(404).json({ msg: 'Post not found' });

        const newLikes = (doc.data().likes || 0) + 1;
        await ref.update({ likes: newLikes });
        res.json({ likes: newLikes });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tribe/seed
// @desc    Seed sample tribe posts
router.post('/seed', async (req, res) => {
    try {
        const posts = [
            {
                authorName: "Ariana Kwesi",
                authorAvatar: "https://i.pravatar.cc/150?img=47",
                destination: "Spiti Valley",
                country: "India",
                image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80",
                title: "The Moon on Earth — My Spiti Pilgrimage",
                story: "Seven days at 14,000 feet. No WiFi. Just the sound of ancient monasteries humming in the wind. This is the reset every modern soul needs. The stars here aren't just visible, they are loud.",
                tags: ["High Altitude", "Spiritual", "Offbeat"],
                likes: 342,
                comments: 48,
                category: "Adventure",
                isEcoCertified: true,
                travelStyle: "Solo",
                rating: 5.0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                authorName: "Luca Fontana",
                authorAvatar: "https://i.pravatar.cc/150?img=12",
                destination: "Amalfi Coast",
                country: "Italy",
                image: "https://images.unsplash.com/photo-1633321088355-d0f81137ca3b?w=800&q=80",
                title: "Lemons, Sea, and Slow Time",
                story: "We drove a Vespa along the cliffside roads at golden hour. Every turn revealed a colour more vivid than the last. The Amalfi isn't a coast — it's a painting you fall into.",
                tags: ["Scenic", "Luxury", "Coastal"],
                likes: 518,
                comments: 63,
                category: "Romantic",
                isEcoCertified: false,
                travelStyle: "Couple",
                rating: 4.9,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                authorName: "Meera Pillai",
                authorAvatar: "https://i.pravatar.cc/150?img=32",
                destination: "Kerala Backwaters",
                country: "India",
                image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
                title: "A Houseboat Diary — God's Own Country",
                story: "Woke up to the sound of kingfishers. Our houseboat drifted through a mirror of green and blue. We ate fresh coconut fish curry at sunrise. There is no luxury that competes with this.",
                tags: ["Waterways", "Culture", "Greenery"],
                likes: 291,
                comments: 34,
                category: "Nature",
                isEcoCertified: true,
                travelStyle: "Family",
                rating: 4.9,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                authorName: "Kai Tanaka",
                authorAvatar: "https://i.pravatar.cc/150?img=68",
                destination: "Kyoto Arashiyama",
                country: "Japan",
                image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
                title: "Walking the Bamboo Silence",
                story: "I arrived at dawn before the crowds. The bamboo grove makes a sound unlike anything else on earth — a deep, whispering creak. Arashiyama teaches you how to be still.",
                tags: ["Zen", "Temples", "Forest"],
                likes: 764,
                comments: 92,
                category: "Culture",
                isEcoCertified: true,
                travelStyle: "Solo",
                rating: 5.0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                authorName: "Zara Osei",
                authorAvatar: "https://i.pravatar.cc/150?img=56",
                destination: "Serengeti Safari",
                country: "Tanzania",
                image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
                title: "The Great Migration — A Witness Account",
                story: "A million wildebeest in motion. The earth itself vibrated beneath our truck. I've looked into the eyes of a lioness from ten meters away. We are guests on this planet.",
                tags: ["Wildlife", "Safari", "Africa"],
                likes: 932,
                comments: 118,
                category: "Nature",
                isEcoCertified: true,
                travelStyle: "Group",
                rating: 5.0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                authorName: "Sofia Andrade",
                authorAvatar: "https://i.pravatar.cc/150?img=23",
                destination: "Maldives Atolls",
                country: "Maldives",
                image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
                title: "When the Ocean is Your Floor",
                story: "Our villa sat directly on the lagoon. At night, bioluminescent plankton lit the waves blue. This kind of beauty makes you want to protect every drop of ocean on this planet.",
                tags: ["Ocean", "Luxury", "Marine Life"],
                likes: 1203,
                comments: 145,
                category: "Beach",
                isEcoCertified: false,
                travelStyle: "Couple",
                rating: 5.0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];

        // Delete all existing posts
        const existing = await db.collection('tribePosts').get();
        const deleteBatch = db.batch();
        existing.docs.forEach(doc => deleteBatch.delete(doc.ref));
        await deleteBatch.commit();

        // Insert new posts
        const insertBatch = db.batch();
        posts.forEach(post => {
            const ref = db.collection('tribePosts').doc();
            insertBatch.set(ref, post);
        });
        await insertBatch.commit();

        res.json({ msg: 'Tribe posts seeded!', count: posts.length });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
