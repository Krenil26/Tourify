const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    image: { type: String },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    tags: [String],
    bestTime: { type: String },
    flightTime: { type: String },
    description: { type: String },
    natureFocus: { type: Boolean, default: true },
    coordinates: {
        lat: Number,
        lng: Number
    },
    accommodations: [{
        name: String,
        type: { type: String }, // 'Resort', 'Hotel', 'Villa'
        pricePerNight: Number,
        image: String
    }],
    rentals: [{
        vehicleType: String, // 'Car', 'Bike', 'Scooter'
        name: String,
        pricePerDay: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
