const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Destination = require('./models/Destination');
const Notification = require('./models/Notification');
const TribePost = require('./models/TribePost');
const Wildlife = require('./models/Wildlife');
require('dotenv').config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB...');

        // 1. Seed Users
        await User.deleteMany();
        const hashedPassword = await bcrypt.hash('password123', 10);

        const users = [
            {
                name: 'Admin User',
                email: 'admin@tourifyy.com',
                password: hashedPassword,
                role: 'admin'
            },
            {
                name: 'Test Customer',
                email: 'customer@tourifyy.com',
                password: hashedPassword,
                role: 'customer'
            }
        ];
        await User.insertMany(users);
        console.log('✅ Users seeded: admin@tourifyy.com / password123');

        // 2. Seed Destinations (Sample)
        await Destination.deleteMany();
        const destinations = [
            {
                name: 'Kyoto',
                country: 'Japan',
                category: 'Culture',
                price: 1200,
                rating: 4.9,
                reviews: 128,
                image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
                description: 'Ancient temples and serene bamboo groves.',
                tags: ['Zen', 'Temple'],
                bestTime: 'Spring/Autumn',
                coordinates: { lat: 35.0116, lng: 135.7681 }
            },
            {
                name: 'Amalfi Coast',
                country: 'Italy',
                category: 'Beach',
                price: 1500,
                rating: 4.8,
                reviews: 245,
                image: 'https://images.unsplash.com/photo-1633321088355-d0f81137ca3b?w=800&q=80',
                description: 'Dramatic cliffs and turquoise waters.',
                tags: ['Coastal', 'Luxury'],
                bestTime: 'Summer'
            }
        ];
        await Destination.insertMany(destinations);
        console.log('✅ Destinations seeded');

        // 3. Seed Notifications
        await Notification.deleteMany();
        await Notification.create([
            { title: 'Welcome to Tourifyy', message: 'Explore the world mindfully.', type: 'info' },
            { title: 'Nature Alert', message: 'High wind in Kyoto trails.', type: 'alert' }
        ]);
        console.log('✅ Notifications seeded');

        console.log('\x1b[32m%s\x1b[0m', '\nAll data seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
