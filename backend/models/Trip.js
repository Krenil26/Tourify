const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    dates: {
        start: Date,
        end: Date
    },
    travelers: Number,
    budget: Number,
    itinerary: Array,
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', tripSchema);
