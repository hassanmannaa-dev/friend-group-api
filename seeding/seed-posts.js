const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Post = require('../models/Post');

// Sample data for different post types
const imagePosts = [
  {
    caption: "Test Image 1",
    mediaUrl: "https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/temp/images/rickroll-roll.gif"
  },
];

const videoPosts = [
  {
    caption: "For Fatima! 🎂",
    mediaUrl: "https://youtu.be/ncQhIzEYVXw"
  },
  {
    caption: "For Lea! 🎂",
    mediaUrl: "https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/temp/videos/lea.mp4"
  },
];

const blogPosts = [
  {
    caption: "Test Blog 1",
    content: `Living sustainably isn't just about recycling or using less plastic. It's about making conscious choices every day that benefit our planet and future generations.

I've been on this journey for the past year, and I've learned that small changes can make a big difference. From switching to reusable water bottles to supporting local farmers, every decision counts.

The most surprising thing I've discovered is how much money you can actually save by living more sustainably. Buying in bulk, growing your own herbs, and repairing instead of replacing have all helped me reduce my monthly expenses.

What sustainable practices have you adopted? I'd love to hear your experiences and tips!`
  },
  {
    caption: "Test Blog 2",
    content: `Cooking has become my meditation. There's something therapeutic about chopping vegetables, measuring ingredients, and watching a dish come together.

I've learned that cooking mindfully means being present in the moment. It's not just about the end result, but the entire process. The sound of onions sizzling, the aroma of garlic and herbs, the feel of dough between your fingers.

My favorite part is sharing meals with friends and family. Food has this incredible power to bring people together, to create memories, and to show love.

Today I made my grandmother's pasta recipe. As I rolled the dough, I thought about all the times she taught me in her kitchen. Cooking connects us to our heritage, to our loved ones, and to ourselves.

What's your favorite recipe and the story behind it?`
  }
];

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

// Generate a random user from existing users
async function getRandomUser() {
  const users = await User.find({ isActive: true });
  if (users.length === 0) {
    throw new Error('No active users found. Please run the user seeder first.');
  }
  return users[Math.floor(Math.random() * users.length)];
}

// Get a specific user by ID
async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found.`);
  }
  if (!user.isActive) {
    throw new Error(`User with ID ${userId} is not active.`);
  }
  return user;
}

// Seed posts by type
async function seedPostsByType(posts, type, userId = null) {
  const createdPosts = [];
  
  for (const postData of posts) {
    const author = userId ? await getUserById(userId) : await getRandomUser();
    
    const post = new Post({
      author: author._id,
      type,
      caption: postData.caption,
      content: type === 'blog' ? postData.content : undefined,
      mediaUrl: type !== 'blog' ? postData.mediaUrl : undefined,
      likes: [],
      comments: [],
      isActive: true
    });
    
    const savedPost = await post.save();
    createdPosts.push(savedPost);
    
    console.log(`Created ${type} post: "${postData.caption.substring(0, 50)}..." by ${author.fullName}`);
  }
  
  return createdPosts;
}

// Seed the database
async function seedPosts(userId = null) {
  try {
    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Seed image posts
    console.log('\nSeeding image posts...');
    const imagePostsCreated = await seedPostsByType(imagePosts, 'image', userId);
    
    // Seed video posts
    console.log('\nSeeding video posts...');
    const videoPostsCreated = await seedPostsByType(videoPosts, 'video', userId);
    
    // Seed blog posts
    console.log('\nSeeding blog posts...');
    const blogPostsCreated = await seedPostsByType(blogPosts, 'blog', userId);

    console.log('\n=== Seeding Summary ===');
    console.log(`Image posts created: ${imagePostsCreated.length}`);
    console.log(`Video posts created: ${videoPostsCreated.length}`);
    console.log(`Blog posts created: ${blogPostsCreated.length}`);
    console.log(`Total posts created: ${imagePostsCreated.length + videoPostsCreated.length + blogPostsCreated.length}`);

    // Display sample posts
    console.log('\nSample posts created:');
    const allPosts = [...imagePostsCreated, ...videoPostsCreated, ...blogPostsCreated];
    allPosts.slice(0, 5).forEach(post => {
      console.log(`- [${post.type.toUpperCase()}] "${post.caption.substring(0, 40)}..."`);
    });

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

// Run the seeding
if (require.main === module) {
  // Check if a user ID is provided as a command line argument
  const userId = '688dede2e9d1e26f19e9d26b' || null;
  
  if (userId) {
    console.log(`Seeding posts for user ID: ${userId}`);
  } else {
    console.log('Seeding posts with random users');
  }
  
  connectDB().then(() => seedPosts(userId));
}

module.exports = { seedPosts, getUserById, videoPosts }; 