const mongoose = require('mongoose');

const tribePostSchema = new mongoose.Schema({
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: '' },
    destination: { type: String, required: true },
    country: { type: String, required: true },
    image: { type: String, default: '' },
    title: { type: String, required: true },
    story: { type: String, required: true },
    tags: [String],
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    category: { type: String, default: 'Nature' }, // Nature, Beach, City, Adventure, Culture
    isEcoCertified: { type: Boolean, default: false },
    travelStyle: { type: String, default: 'Solo' }, // Solo, Couple, Family, Group
    rating: { type: Number, default: 5.0 },
}, { timestamps: true });

module.exports = mongoose.model('TribePost', tribePostSchema);
