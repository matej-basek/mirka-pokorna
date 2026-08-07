const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    course: { type: String, default: '' },
    rating: { type: Number, default: 5 },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
