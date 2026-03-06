require('dotenv').config({ path: './backend/.env' });
const { db } = require('./firebase');

const destinations = [
    {
        name: 'Olympic National Forest',
        country: 'USA',
        category: 'Forest',
        price: 0,
        rating: 4.9,
        reviews: 1240,
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
        description: 'Vast temperate rainforest with moss-covered trees and ancient ecosystems.',
        tags: ['Rainforest', 'Eco-friendly', 'Ancient'],
        bestTime: 'May - Sept',
        flightTime: '2h (from SEA)',
        natureFocus: true,
        coordinates: { lat: 47.6062, lng: -123.6749 }
    },
    {
        name: 'Arashiyama Bamboo Grove',
        country: 'Japan',
        category: 'Zen',
        price: 0,
        rating: 4.8,
        reviews: 5620,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
        description: 'Iconic bamboo paths offering a meditative atmosphere and spiritual calm.',
        tags: ['Zen', 'Spiritual', 'Iconic'],
        bestTime: 'April or Nov',
        flightTime: '1.5h (from NRT)',
        natureFocus: true,
        coordinates: { lat: 35.0116, lng: 135.6715 }
    },
    {
        name: 'Santorini Caldera',
        country: 'Greece',
        category: 'Coastal',
        price: 2500,
        rating: 4.9,
        reviews: 3200,
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
        description: 'Breath-taking cliffside walks overlooking the submerged volcanic crater.',
        tags: ['Volcanic', 'Luxury', 'Sunset'],
        bestTime: 'May - Sept',
        flightTime: '45m (from ATH)',
        natureFocus: false,
        coordinates: { lat: 36.3932, lng: 25.4615 }
    },
    {
        name: 'Serengeti Plains',
        country: 'Tanzania',
        category: 'Savanna',
        price: 3200,
        rating: 5.0,
        reviews: 1850,
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
        description: 'The theater of the Great Migration and home to the world\'s most pristine wildlife.',
        tags: ['Wildlife', 'Adventure', 'Safari'],
        bestTime: 'July - Oct',
        flightTime: '1h (from JRO)',
        natureFocus: true,
        coordinates: { lat: -2.3333, lng: 34.8333 }
    },
    {
        name: 'Maldives Atolls',
        country: 'Maldives',
        category: 'Marine',
        price: 4500,
        rating: 4.8,
        reviews: 2100,
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
        description: 'Crystal clear lagoons and underwater sanctuaries with vibrant coral reefs.',
        tags: ['Dive', 'Luxury', 'Tropical'],
        bestTime: 'Nov - April',
        flightTime: '4h (from DXB)',
        natureFocus: true,
        coordinates: { lat: 3.2028, lng: 73.2207 }
    },
    {
        name: 'Kerala Backwaters',
        country: 'India',
        category: 'Wetlands',
        price: 800,
        rating: 4.7,
        reviews: 950,
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
        description: 'Lush green waterways and traditional houseboats in God\'s Own Country.',
        tags: ['Culture', 'Serene', 'Nature'],
        bestTime: 'Sept - March',
        flightTime: '1h (from COK)',
        natureFocus: true,
        coordinates: { lat: 9.4981, lng: 76.3329 }
    }
];

const wildlife = [
    {
        name: 'Snow Leopard',
        scientificName: 'Panthera uncia',
        type: 'Fauna',
        species: 'Mammal',
        image: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=800&q=80',
        description: 'The ghost of the mountains, rarely seen and endlessly mystifying.',
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
        description: "India's national animal and a keystone species.",
        habitat: ['Forest', 'Mangrove', 'Grassland'],
        foundIn: ['India', 'Bangladesh'],
        conservationStatus: 'Endangered',
        isEndangered: true,
        funFact: "Each tiger's stripe pattern is unique, like a human fingerprint.",
        bestSpottingTime: 'Mar – Jun',
        tags: ['Apex Predator', 'Iconic', 'Jungle'],
        sightings: 879,
    },
    {
        name: 'Japanese Macaque',
        scientificName: 'Macaca fuscata',
        type: 'Fauna',
        species: 'Primate',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
        description: "Famous for bathing in hot springs during winter.",
        habitat: ['Forest', 'Mountain', 'Hot Spring'],
        foundIn: ['Japan'],
        conservationStatus: 'Least Concern',
        isEndangered: false,
        funFact: 'These monkeys learn new behaviours socially and pass them down generations.',
        bestSpottingTime: 'Dec – Mar',
        tags: ['Primate', 'Japan', 'Onsen'],
        sightings: 1540,
    },
    {
        name: 'Manta Ray',
        scientificName: 'Mobula alfredi',
        type: 'Fauna',
        species: 'Marine',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        description: 'Graceful giants of the ocean, with wingspans reaching 7 metres.',
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
        name: 'Cherry Blossom',
        scientificName: 'Prunus serrulata',
        type: 'Flora',
        species: 'Tree',
        image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80',
        description: "Japan's most iconic bloom. A symbol of the transient beauty of life.",
        habitat: ['Temperate Forest', 'Urban Park'],
        foundIn: ['Japan'],
        conservationStatus: 'Least Concern',
        isEndangered: false,
        funFact: 'Hanami (flower viewing) has been practiced in Japan for over 1,000 years.',
        bestSpottingTime: 'Mar – May',
        tags: ['Sakura', 'Japan', 'Spring', 'Iconic'],
        sightings: 8870,
    }
];

const tribePosts = [
    {
        authorName: "Ariana Kwesi",
        authorAvatar: "https://i.pravatar.cc/150?img=47",
        destination: "Spiti Valley",
        country: "India",
        image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80",
        title: "The Moon on Earth — My Spiti Pilgrimage",
        story: "Seven days at 14,000 feet. No WiFi. Just the sound of ancient monasteries humming in the wind.",
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
        story: "We drove a Vespa along the cliffside roads at golden hour. Every turn revealed a colour more vivid than the last.",
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
        authorName: "Kai Tanaka",
        authorAvatar: "https://i.pravatar.cc/150?img=68",
        destination: "Kyoto Arashiyama",
        country: "Japan",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
        title: "Walking the Bamboo Silence",
        story: "I arrived at dawn before the crowds. The bamboo grove makes a sound unlike anything else on earth — a deep, whispering creak.",
        tags: ["Zen", "Temples", "Forest"],
        likes: 764,
        comments: 92,
        category: "Culture",
        isEcoCertified: true,
        travelStyle: "Solo",
        rating: 5.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

const notifications = [
    {
        title: "Eco-Trail Tip",
        message: "New nature trails have been added to your Santorini guide! Check them out now.",
        type: "info",
        isRead: false,
        createdAt: new Date().toISOString(),
    },
    {
        title: "Achievement Unlocked",
        message: "You've explored 5 different biomes this month. You're a true Earth Guardian!",
        type: "success",
        isRead: false,
        createdAt: new Date().toISOString(),
    },
    {
        title: "Weather Alert",
        message: "Upcoming rain in Munnar might affect trail accessibility. Plan accordingly.",
        type: "alert",
        isRead: false,
        createdAt: new Date().toISOString(),
    }
];

const seedData = async () => {
    try {
        console.log('Starting Master Firebase Seed...');

        // 1. Seed Destinations
        console.log('Seeding Destinations...');
        const destRef = db.collection('destinations');
        const destSnapshot = await destRef.get();
        const destBatch = db.batch();
        destSnapshot.docs.forEach(doc => destBatch.delete(doc.ref));
        await destBatch.commit();

        const destInsertBatch = db.batch();
        destinations.forEach(dest => {
            const ref = destRef.doc();
            destInsertBatch.set(ref, dest);
        });
        await destInsertBatch.commit();
        console.log(`✅ ${destinations.length} Destinations seeded.`);

        // 2. Seed Wildlife
        console.log('Seeding Wildlife...');
        const wildRef = db.collection('wildlife');
        const wildSnapshot = await wildRef.get();
        const wildBatch = db.batch();
        wildSnapshot.docs.forEach(doc => wildBatch.delete(doc.ref));
        await wildBatch.commit();

        const wildInsertBatch = db.batch();
        wildlife.forEach(w => {
            const ref = wildRef.doc();
            wildInsertBatch.set(ref, w);
        });
        await wildInsertBatch.commit();
        console.log(`✅ ${wildlife.length} Wildlife entries seeded.`);

        // 3. Seed Tribe Posts
        console.log('Seeding Tribe Posts...');
        const tribeRef = db.collection('tribePosts');
        const tribeSnapshot = await tribeRef.get();
        const tribeBatch = db.batch();
        tribeSnapshot.docs.forEach(doc => tribeBatch.delete(doc.ref));
        await tribeBatch.commit();

        const tribeInsertBatch = db.batch();
        tribePosts.forEach(post => {
            const ref = tribeRef.doc();
            tribeInsertBatch.set(ref, post);
        });
        await tribeInsertBatch.commit();
        console.log(`✅ ${tribePosts.length} Tribe posts seeded.`);

        // 4. Seed Notifications
        console.log('Seeding Notifications...');
        const notifRef = db.collection('notifications');
        const notifSnapshot = await notifRef.get();
        const notifBatch = db.batch();
        notifSnapshot.docs.forEach(doc => notifBatch.delete(doc.ref));
        await notifBatch.commit();

        const notifInsertBatch = db.batch();
        notifications.forEach(n => {
            const ref = notifRef.doc();
            notifInsertBatch.set(ref, n);
        });
        await notifInsertBatch.commit();
        console.log(`✅ ${notifications.length} Notifications seeded.`);

        console.log('Master Firebase Seed Completed Successfully! 🚀');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during master seed:', error);
        process.exit(1);
    }
};

seedData();
