const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, required: true }, // Store lucide icon name as string
    className: { type: String },
    gradient: { type: String },
    link: { type: String, default: "/planner" },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Feature', featureSchema);
