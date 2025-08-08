const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const firstNames = [
  'Hassan', 'Lea', 'Fatima', 'Karim', 'Reina'
];

const lastNames = [
  'Mannaa', 'Khalife', 'Slim', 'yi w er sho 3yltak', 'Khalife'
];

const avatarUrls = [
  'https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/avatars/images/hassan.webp',
  'https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/avatars/images/lea.webp', 
  'https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/avatars/images/fatima.jpg',
  'https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/avatars/images/karim.jpg',
  'https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/avatars/images/reina.jpg'
];

function generateUser(index) {
  const firstName = firstNames[index];
  const lastName = lastNames[index];
  const avatarUrl = avatarUrls[index];
  
  return {
    firstName,
    lastName,
    avatarUrl,
    password: 'password123', // Default password for seeded users
    isActive: true
  };
}

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/friend-group');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Seed the database
async function seedDatabase() {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Generate and insert users individually to trigger password hashing
    const createdUsers = [];
    const numUsers = 5; // Number of users to seed

    for (let i = 0; i < numUsers; i++) {
      const userData = generateUser(i);
      const user = new User(userData);
      const savedUser = await user.save();
      createdUsers.push(savedUser);
    }

    console.log(`Successfully seeded ${createdUsers.length} users`);

    // Display some sample users
    console.log('\nSample seeded users:');
    createdUsers.slice(0, 5).forEach(user => {
      console.log(`- ${user.fullName} (${user.avatarUrl})`);
    });

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the seeding
if (require.main === module) {
  connectDB().then(seedDatabase);
}

module.exports = { seedDatabase, generateUser }; 