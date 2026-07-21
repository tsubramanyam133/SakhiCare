import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User, Role } from './src/models/User';

dotenv.config();

async function createAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not defined in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in environment');
      process.exit(1);
    }
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists, updating to ADMIN and updating password');
      user.role = Role.ADMIN;
      user.passwordHash = await bcrypt.hash(password, 10);
      user.isEmailVerified = true;
      await user.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      const passwordHash = await bcrypt.hash(password, 10);
      user = new User({
        email,
        passwordHash,
        role: Role.ADMIN,
        isEmailVerified: true,
        status: 'active'
      });
      await user.save();
      console.log('Admin user created successfully.');
    }
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

createAdmin();
