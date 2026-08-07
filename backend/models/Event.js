const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    registrationUrl: { type: String, default: '' },
    date: { type: String, default: '' },
    location: { type: String, default: '' },
    price: { type: String, default: '' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
