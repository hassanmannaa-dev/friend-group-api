const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the User model
const User = require('./models/User');

// Sample first names and last names for variety
const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Isabella', 'Lucas',
  'Sophia', 'Mason', 'Mia', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'James',
  'Harper', 'Benjamin', 'Evelyn', 'Sebastian', 'Abigail', 'Michael', 'Emily',
  'Daniel', 'Elizabeth', 'Henry', 'Sofia', 'Jackson', 'Avery', 'Samuel',
  'Ella', 'David', 'Madison', 'Joseph', 'Scarlett', 'Carter', 'Victoria',
  'Owen', 'Luna', 'Wyatt', 'Grace', 'John', 'Chloe', 'Jack', 'Penelope',
  'Luke', 'Layla', 'Jayden', 'Riley', 'Dylan', 'Zoey', 'Grayson', 'Nora'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts'
];

// Different avatar services for variety
const avatarServices = [
  // DiceBear Avataaars (cartoon style)
  (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
  
  // DiceBear Personas (more realistic)
  (seed) => `https://api.dicebear.com/7.x/personas/svg?seed=${seed}`,
  
  // DiceBear Bottts (robot style)
  (seed) => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`,
  
  // DiceBear Identicon (geometric)
  (seed) => `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`,
  
  // DiceBear Initials (letter-based)
  (seed) => `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`,
  
  // UI Faces (realistic photos) - using placeholder
  (seed) => `https://images.unsplash.com/photo-${Math.floor(Math.random() * 999999)}?w=150&h=150&fit=crop&crop=face`,
  
  // Gravatar-style (using hash)
  (seed) => `https://www.gravatar.com/avatar/${Buffer.from(seed).toString('hex').substring(0, 32)}?d=identicon&s=150`,
  
  // RoboHash (robot avatars)
  (seed) => `https://robohash.org/${seed}?set=set1&size=150x150`,
  
  // RoboHash with cats
  (seed) => `https://robohash.org/${seed}?set=set2&size=150x150`,
  
  // RoboHash with monsters
  (seed) => `https://robohash.org/${seed}?set=set3&size=150x150`
];

// Generate avatar URL using random service
function generateAvatarUrl(seed) {
  const randomService = avatarServices[Math.floor(Math.random() * avatarServices.length)];
  return randomService(seed);
}

// Generate a random user
function generateUser() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const seed = `${firstName}${lastName}${Date.now()}${Math.random()}`;
  const avatarUrl = generateAvatarUrl(seed);
  
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

    // Generate and insert users
    const users = [];
    const numUsers = 30; // Number of users to seed

    for (let i = 0; i < numUsers; i++) {
      const userData = generateUser();
      users.push(userData);
    }

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`Successfully seeded ${createdUsers.length} users with varied avatar styles`);

    // Display some sample users
    console.log('\nSample seeded users:');
    createdUsers.slice(0, 8).forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullName}`);
      console.log(`   Avatar: ${user.avatarUrl}`);
      console.log('');
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