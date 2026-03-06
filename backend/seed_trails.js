require('dotenv').config();
const { db } = require('./firebase');

const trailsData = [
    {
        name: "Olympic Forest Loop",
        location: "Olympic National Park, USA",
        distance: "5.2 miles",
        difficulty: "Moderate",
        elevationGain: "420 ft",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
        description: "A beautiful loop through ancient mossy forests and along the misty river banks.",
        tags: ["Forest", "River", "Shaded"]
    },
    {
        name: "Santorini Cliff Path",
        location: "Oia, Greece",
        distance: "3.1 miles",
        difficulty: "Easy",
        elevationGain: "150 ft",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
        description: "Stunning coastal walk with views of the Aegean Sea and white-washed villages.",
        tags: ["Coastal", "Scenic", "Sunset"]
    },
    {
        name: "Arashiyama Bamboo Grove",
        location: "Kyoto, Japan",
        distance: "2.5 miles",
        difficulty: "Easy",
        elevationGain: "80 ft",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
        description: "Walk through the towering bamboo stalks and experience true Zen tranquility.",
        tags: ["Zen", "Shaded", "Cultural"]
    },
    {
        name: "Banff Moraine Lake Trail",
        location: "Banff, Canada",
        distance: "4.8 miles",
        difficulty: "Moderate",
        elevationGain: "300 ft",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
        description: "Azure waters and snow-capped peaks surround this majestic alpine trail.",
        tags: ["Alpine", "Lakes", "Wilderness"]
    },
    {
        name: "Machu Picchu Inca Trail",
        location: "Andes, Peru",
        distance: "26 miles",
        difficulty: "Hard",
        elevationGain: "13,830 ft",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
        description: "The historic pilgrimage to the lost city of the Incas. A true adventure of a lifetime.",
        tags: ["Historic", "High Altitude", "Adventurous"]
    }
];

const seedTrails = async () => {
    try {
        console.log('Seeding trails to Firebase...');
        const trailsRef = db.collection('trails');

        // Use batch to add trails
        const batch = db.batch();

        trailsData.forEach(trail => {
            const docRef = trailsRef.doc(); // Auto-generate ID
            batch.set(docRef, {
                ...trail,
                createdAt: new Date().toISOString()
            });
        });

        await batch.commit();
        console.log('✅ Successfully added 5 trails to Firebase Firestore!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding trails:', err);
        process.exit(1);
    }
};

seedTrails();
