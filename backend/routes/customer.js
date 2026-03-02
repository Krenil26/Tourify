const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Destination = require('../models/Destination');
const { authMiddleware } = require('../middleware/auth');

// @route   GET api/customer/profile
// @desc    Get logged in customer profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/customer/profile
// @desc    Update customer profile details
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, phone, location } = req.body;

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (phone) updatedFields.phone = phone;
        if (location) updatedFields.location = location;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updatedFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
