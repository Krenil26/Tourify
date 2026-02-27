const mongoose = require('mongoose');

const wildlifeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    scientificName: { type: String },
    type: { type: String, enum: ['Flora', 'Fauna'], required: true },
    species: { type: String }, // e.g. 'Mammal', 'Bird', 'Reptile', 'Tree', 'Flower'
    image: { type: String },
    description: { type: String },
    habitat: [String],          // e.g. ['Forest', 'Mountain', 'Wetland']
    foundIn: [String],          // destination / country names
    conservationStatus: { type: String, default: 'Least Concern' }, // IUCN
    isEndangered: { type: Boolean, default: false },
    funFact: { type: String },
    bestSpottingTime: { type: String },
    tags: [String],
    sightings: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Wildlife', wildlifeSchema);
