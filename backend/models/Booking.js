const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: String,
    userEmail: String,
    destination: {
        type: String,
        required: true
    },
    travelers: {
        type: Number,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    startDate: String,
    endDate: String,
    styles: [String],
    itinerary: Array,
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "cancelled"],
        default: "pending"
    },
    totalCost: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Booking", BookingSchema);
