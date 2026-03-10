const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');

// Create a trip (User)
router.post('/', auth, async (req, res) => {
    try {
        const { destination, dates, travelers, budget, itinerary } = req.body;
        const newTrip = new Trip({
            user: req.user.id,
            destination,
            dates,
            travelers,
            budget,
            itinerary,
            paymentStatus: 'pending',
            approvalStatus: 'pending'
        });
        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Pay for a trip (User)
router.put('/:id/pay', auth, async (req, res) => {
    try {
        const trip = await Trip.findOne({ _id: req.params.id, user: req.user.id });
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        trip.paymentStatus = 'paid';
        await trip.save();
        res.json(trip);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's trips (User)
router.get('/user', auth, async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get trips for admin approval (Admin)
router.get('/admin', auth, async (req, res) => {
    try {
        // Only return trips that are paid and pending approval
        const trips = await Trip.find({ paymentStatus: 'paid', approvalStatus: 'pending' }).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(trips);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Approve a trip (Admin)
router.put('/:id/approve', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        trip.approvalStatus = 'approved';
        await trip.save();
        res.json(trip);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reject a trip (Admin)
router.put('/:id/reject', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        trip.approvalStatus = 'rejected';
        await trip.save();
        res.json(trip);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
