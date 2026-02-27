const mongoose = require('mongoose');
const Notification = require('./models/Notification');
require('dotenv').config();

const notifications = [
    {
        title: "Eco-Trail Tip",
        message: "New nature trails have been added to your Santorini guide! Check them out now.",
        type: "info"
    },
    {
        title: "Achievement Unlocked",
        message: "You've explored 5 different biomes this month. You're a true Earth Guardian!",
        type: "success"
    },
    {
        title: "Weather Alert",
        message: "Upcoming rain in Munnar might affect trail accessibility. Plan accordingly.",
        type: "alert"
    },
    {
        title: "AI Planner Update",
        message: "Our AI just got smarter! It can now suggest the best vehicle for specific terrains.",
        type: "info"
    }
];

const seedNotifications = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Notification.deleteMany();
        await Notification.insertMany(notifications);
        console.log('Notifications seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedNotifications();
