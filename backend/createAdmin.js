import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for admin user creation');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      console.log('You can use this admin account to get an admin token.');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@quickdesk.com',
      password: 'admin123',
      role: 'admin',
      department: 'Administration',
      phone: '+1234567890'
    });

    console.log('✅ Admin user created successfully:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: admin123`);
    console.log(`Name: ${adminUser.name}`);
    console.log(`Role: ${adminUser.role}`);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
};

createAdminUser();
