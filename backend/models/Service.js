const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String, required: true },
    benefits: { type: [String], default: [] },
    imageUrl: { type: String, default: '' },
    icon: { type: String, default: 'flower' }, // 'flower' | 'music' | 'smile' | 'heart' | 'star'
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
