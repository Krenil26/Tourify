const express = require('express');
const router = express.Router();
const Wildlife = require('../models/Wildlife');

// @route   GET api/wildlife
// @desc    Get all wildlife, with optional filters
router.get('/', async (req, res) => {
    try {
        const { type, species, status, q } = req.query;
        let query = {};
        if (type && type !== 'All') query.type = type;
        if (species && species !== 'All') query.species = species;
        if (status === 'endangered') query.isEndangered = true;
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { scientificName: { $regex: q, $options: 'i' } },
                { tags: { $regex: q, $options: 'i' } },
                { foundIn: { $regex: q, $options: 'i' } },
            ];
        }
        const wildlife = await Wildlife.find(query).sort({ sightings: -1 });
        res.json(wildlife);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/wildlife/stats
// @desc    Get summary stats
router.get('/stats', async (req, res) => {
    try {
        const total = await Wildlife.countDocuments();
        const flora = await Wildlife.countDocuments({ type: 'Flora' });
        const fauna = await Wildlife.countDocuments({ type: 'Fauna' });
        const endangered = await Wildlife.countDocuments({ isEndangered: true });
        res.json({ total, flora, fauna, endangered });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/wildlife/:id/sight
// @desc    Record a sighting
router.put('/:id/sight', async (req, res) => {
    try {
        const w = await Wildlife.findByIdAndUpdate(req.params.id, { $inc: { sightings: 1 } }, { new: true });
        if (!w) return res.status(404).json({ msg: 'Not found' });
        res.json({ sightings: w.sightings });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/wildlife/seed
// @desc    Seed sample wildlife data
router.post('/seed', async (req, res) => {
    try {
        const entries = [
            // ── FAUNA ──
            {
                name: 'Snow Leopard',
                scientificName: 'Panthera uncia',
                type: 'Fauna',
                species: 'Mammal',
                image: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=800&q=80',
                description: 'The ghost of the mountains, rarely seen and endlessly mystifying. Roams the cold, rugged highlands of Central Asia at elevations above 3,000 metres.',
                habitat: ['Mountain', 'Alpine'],
                foundIn: ['India', 'Nepal', 'Bhutan'],
                conservationStatus: 'Vulnerable',
                isEndangered: true,
                funFact: 'A snow leopard cannot roar — it makes a unique sound called a "chuff".',
                bestSpottingTime: 'Feb – Apr',
                tags: ['Apex Predator', 'Himalayan', 'Elusive'],
                sightings: 312,
            },
            {
                name: 'Bengal Tiger',
                scientificName: 'Panthera tigris tigris',
                type: 'Fauna',
                species: 'Mammal',
                image: 'https://images.unsplash.com/photo-1615457015775-60ed4b5d3be1?w=800&q=80',
                description: 'India\'s national animal and a keystone species. Found in the dense forests of Sundarbans, Ranthambore, and Corbett.',
                habitat: ['Forest', 'Mangrove', 'Grassland'],
                foundIn: ['India', 'Bangladesh'],
                conservationStatus: 'Endangered',
                isEndangered: true,
                funFact: 'Each tiger\'s stripe pattern is unique, like a human fingerprint.',
                bestSpottingTime: 'Mar – Jun',
                tags: ['Apex Predator', 'Iconic', 'Jungle'],
                sightings: 879,
            },
            {
                name: 'African Elephant',
                scientificName: 'Loxodonta africana',
                type: 'Fauna',
                species: 'Mammal',
                image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80',
                description: 'The largest land animal on Earth. A keystone species that shapes entire ecosystems through foraging and movement.',
                habitat: ['Savanna', 'Forest', 'Grassland'],
                foundIn: ['Tanzania', 'Kenya', 'South Africa'],
                conservationStatus: 'Vulnerable',
                isEndangered: true,
                funFact: 'Elephants communicate through infrasound, which humans cannot hear.',
                bestSpottingTime: 'Jun – Oct',
                tags: ['Megafauna', 'Savanna', 'Social'],
                sightings: 2140,
            },
            {
                name: 'Japanese Macaque',
                scientificName: 'Macaca fuscata',
                type: 'Fauna',
                species: 'Primate',
                image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
                description: 'Famous for bathing in hot springs during winter. The world\'s northernmost-living non-human primate, found in Japan\'s mountain forests.',
                habitat: ['Forest', 'Mountain', 'Hot Spring'],
                foundIn: ['Japan'],
                conservationStatus: 'Least Concern',
                isEndangered: false,
                funFact: 'These monkeys learn new behaviours socially and pass them down generations — a form of culture.',
                bestSpottingTime: 'Dec – Mar (for hot spring bathing)',
                tags: ['Primate', 'Japan', 'Onsen'],
                sightings: 1540,
            },
            {
                name: 'Manta Ray',
                scientificName: 'Mobula alfredi',
                type: 'Fauna',
                species: 'Marine',
                image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
                description: 'Graceful giants of the ocean, with wingspans reaching 7 metres. Found in tropical lagoons and coral atolls of the Maldives.',
                habitat: ['Ocean', 'Coral Reef', 'Lagoon'],
                foundIn: ['Maldives', 'Australia'],
                conservationStatus: 'Vulnerable',
                isEndangered: true,
                funFact: 'Manta rays have the largest brain-to-body ratio of any fish on Earth.',
                bestSpottingTime: 'May – Nov',
                tags: ['Marine', 'Dive', 'Gentle Giant'],
                sightings: 986,
            },
            {
                name: 'Wildebeest',
                scientificName: 'Connochaetes taurinus',
                type: 'Fauna',
                species: 'Mammal',
                image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
                description: 'Protagonist of the Great Migration — over 1.5 million move across the Serengeti in one of nature\'s greatest spectacles.',
                habitat: ['Savanna', 'Grassland'],
                foundIn: ['Tanzania', 'Kenya'],
                conservationStatus: 'Least Concern',
                isEndangered: false,
                funFact: 'Wildebeest calves can run within minutes of birth to escape predators.',
                bestSpottingTime: 'Jul – Sep',
                tags: ['Migration', 'Savanna', 'Africa'],
                sightings: 3200,
            },
            // ── FLORA ──
            {
                name: 'Himalayan Blue Poppy',
                scientificName: 'Meconopsis betonicifolia',
                type: 'Flora',
                species: 'Flower',
                image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800&q=80',
                description: 'A rare and ethereal alpine flower found above the treeline in the Himalayas. Its brilliant sky-blue petals are considered sacred in Tibetan culture.',
                habitat: ['Alpine', 'Mountain'],
                foundIn: ['Bhutan', 'India', 'Nepal'],
                conservationStatus: 'Near Threatened',
                isEndangered: false,
                funFact: 'The blue poppy is the national flower of Bhutan and blooms only at altitudes above 4,000m.',
                bestSpottingTime: 'Jun – Aug',
                tags: ['Alpine', 'Sacred', 'Rare'],
                sightings: 234,
            },
            {
                name: 'Cherry Blossom',
                scientificName: 'Prunus serrulata',
                type: 'Flora',
                species: 'Tree',
                image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80',
                description: 'Japan\'s most iconic bloom. A symbol of the transient beauty of life in Japanese philosophy, blooming for only 1–2 weeks each spring.',
                habitat: ['Temperate Forest', 'Urban Park'],
                foundIn: ['Japan'],
                conservationStatus: 'Least Concern',
                isEndangered: false,
                funFact: 'Hanami (flower viewing) has been practiced in Japan for over 1,000 years.',
                bestSpottingTime: 'Mar – May',
                tags: ['Sakura', 'Japan', 'Spring', 'Iconic'],
                sightings: 8870,
            },
            {
                name: 'Baobab Tree',
                scientificName: 'Adansonia digitata',
                type: 'Flora',
                species: 'Tree',
                image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
                description: 'Africa\'s legendary "Tree of Life", which can live for 3,000 years and store up to 120,000 litres of water in its massive trunk.',
                habitat: ['Savanna', 'Dryland'],
                foundIn: ['Tanzania', 'Kenya', 'South Africa'],
                conservationStatus: 'Least Concern',
                isEndangered: false,
                funFact: 'Hollow baobabs have been used as shelters, prisons, pubs, and even a bus stop.',
                bestSpottingTime: 'Year-round',
                tags: ['Ancient', 'Africa', 'Iconic'],
                sightings: 1760,
            },
            {
                name: 'Lotus',
                scientificName: 'Nelumbo nucifera',
                type: 'Flora',
                species: 'Flower',
                image: 'https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=800&q=80',
                description: 'India\'s national flower and a symbol of purity in Hindu, Buddhist, and Jain traditions. Blooms in still, muddy waters — a metaphor for spiritual awakening.',
                habitat: ['Wetland', 'Pond', 'Lake'],
                foundIn: ['India', 'Japan'],
                conservationStatus: 'Least Concern',
                isEndangered: false,
                funFact: 'The lotus flower closes at night and sinks underwater, re-emerging at dawn — symbolising rebirth.',
                bestSpottingTime: 'Jun – Sep',
                tags: ['Sacred', 'Aquatic', 'India'],
                sightings: 4210,
            },
        ];

        await Wildlife.deleteMany();
        const saved = await Wildlife.insertMany(entries);
        res.json({ msg: 'Wildlife seeded!', count: saved.length });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
