const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
    pricePerLesson: { type: String, default: '' },
    courseInfo: { type: String, default: '' },
    coursePrice: { type: String, default: '' },
    additionalInfo: { type: String, default: '' },
});

const studioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    registrationUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    lessons: [lessonSchema],
}, { timestamps: true });

module.exports = mongoose.model('Studio', studioSchema);
