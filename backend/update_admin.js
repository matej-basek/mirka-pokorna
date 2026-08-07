require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mirkapokorna';

async function updateAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    // Smaž všechny stávající admin účty
    await User.deleteMany({});
    console.log('Old admin accounts deleted.');

    // Vytvoř nový admin účet s novým jménem a heslem
    const hashedPassword = await bcrypt.hash('ZIJ135v-lasce', 10);
    const admin = new User({
      username: 'MirkaPokorna',
      passwordHash: hashedPassword
    });
    await admin.save();

    console.log('✅ Admin user updated!');
    console.log('   Username: MirkaPokorna');
    console.log('   Password: ZIJ135v-lasce');
    process.exit(0);
  } catch (err) {
    console.error('Error updating admin:', err);
    process.exit(1);
  }
}

updateAdmin();
