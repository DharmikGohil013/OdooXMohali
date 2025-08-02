import mongoose from 'mongoose';
import Category from './models/Category.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const addMissingCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for adding missing categories');

    // Find an admin user
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.error('No admin user found. Please run seedCategories.js first.');
      return;
    }

    // Categories that are missing
    const missingCategories = [
      {
        name: 'Security',
        description: 'Security-related issues, vulnerabilities, and access problems',
        color: '#F59E0B',
        isActive: true,
        createdBy: adminUser._id
      },
      {
        name: 'Training & Documentation',
        description: 'Help with tutorials, guides, and learning resources',
        color: '#06B6D4',
        isActive: true,
        createdBy: adminUser._id
      },
      {
        name: 'Integration Support',
        description: 'API integrations, third-party connections, and system compatibility',
        color: '#84CC16',
        isActive: true,
        createdBy: adminUser._id
      }
    ];

    // Check which categories already exist
    const existingCategoryNames = await Category.find({}, 'name').lean();
    const existingNames = existingCategoryNames.map(cat => cat.name);

    const categoriesToCreate = missingCategories.filter(cat => 
      !existingNames.includes(cat.name)
    );

    if (categoriesToCreate.length === 0) {
      console.log('All categories already exist!');
      
      // Show all existing categories
      const allCategories = await Category.find({}).sort({ name: 1 });
      console.log('\n📋 All categories in database:');
      allCategories.forEach(cat => {
        console.log(`- ${cat.name} (ID: ${cat._id})`);
      });
      return;
    }

    // Create missing categories
    const createdCategories = await Category.insertMany(categoriesToCreate);
    
    console.log('✅ Missing categories created successfully:');
    createdCategories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat._id})`);
    });

    // Show all categories now
    const allCategories = await Category.find({}).sort({ name: 1 });
    console.log('\n📋 All categories now in database:');
    allCategories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat._id})`);
    });

  } catch (error) {
    console.error('Error adding missing categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB connection closed');
  }
};

addMissingCategories();
