const express = require('express');
const User = require('../models/User');
const { authMiddleware: auth } = require('../middleware/auth');
const router = express.Router();

// Get profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, email, phone, location } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        // Note: If you want to store phone and location, update the User model

        await user.save();
        res.json({ id: user._id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
