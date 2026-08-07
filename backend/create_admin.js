require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mirkapokorna';

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for admin creation...');

    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists.');
    } else {
      const hashedPassword = await bcrypt.hash('ZIJ135v-lasce', 10);
      const admin = new User({
        username: 'admin',
        passwordHash: hashedPassword
      });
      await admin.save();
      console.log('Admin user created successfully! Username: admin, Password: ZIJ135v-lasce');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
