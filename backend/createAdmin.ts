import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User, Role } from './src/models/User';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in environment');
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists, updating role and password');
      existingUser.passwordHash = passwordHash;
      existingUser.role = Role.ADMIN;
      await existingUser.save();
      console.log('Admin user updated successfully.');
    } else {
      await User.create({
        email,
        passwordHash,
        role: Role.ADMIN,
      });
      console.log('Admin user created successfully.');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdmin();
