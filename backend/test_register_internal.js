const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testRegister() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const email = 'test' + Date.now() + '@example.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: 'Test User',
            email: email,
            password: hashedPassword,
            role: 'customer'
        });

        await newUser.save();
        console.log('User created:', newUser.email);

        const found = await User.findOne({ email });
        console.log('Found user in DB:', found ? 'Yes' : 'No');

        await User.deleteOne({ email });
        console.log('Cleaned up test user');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testRegister();
