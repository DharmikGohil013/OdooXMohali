import mongoose from 'mongoose';
import Category from './models/Category.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    // Find an admin user to assign as creator (or create a default one)
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      // Create a default admin user
      adminUser = await User.create({
        name: 'System Admin',
        email: 'admin@quickdesk.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Created default admin user');
    }

    // Check if categories already exist
    const existingCategories = await Category.countDocuments();
    
    if (existingCategories > 0) {
      console.log(`${existingCategories} categories already exist. Here they are:`);
      const categories = await Category.find({});
      categories.forEach(cat => {
        console.log(`- ${cat.name} (ID: ${cat._id})`);
      });
      return;
    }

    // Default categories to create
    const defaultCategories = [
      {
        name: 'Technical Support',
        description: 'Issues related to software, hardware, and technical problems',
        color: '#3B82F6',
        isActive: true,
        createdBy: adminUser._id
      },
      {
        name: 'Account & Billing',
        description: 'Account management, billing questions, and subscription issues',
        color: '#10B981',
        isActive: true,
        createdBy: adminUser._id
      },
      {
        name: 'Bug Report',
        description: 'Report software bugs and unexpected behavior',
        color: '#EF4444',
        isActive: true,
        createdBy: adminUser._id
      },
      {
        name: 'Feature Request',
        description: 'Suggest new features or improvements',
        color: '#8B5CF6',
        isActive: true,
        createdBy: adminUser._id
      },
      {
        name: 'General Inquiry',
        description: 'General questions and information requests',
        color: '#6B7280',
        isActive: true,
        createdBy: adminUser._id
      }
    ];

    // Create categories
    const createdCategories = await Category.insertMany(defaultCategories);
    
    console.log('✅ Default categories created successfully:');
    createdCategories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat._id})`);
    });

  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
};

seedCategories();
