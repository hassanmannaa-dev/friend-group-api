const mongoose = require('mongoose');
require('dotenv').config();

const { createCustomPosts, findUserByFirstName } = require('./seed-posts-advanced');

// Example of how to create custom posts with your own data
const customPosts = [
  // Add your custom posts here
  {
    type: 'image',
    caption: "Your custom image caption here",
    mediaUrl: "https://your-supabase-url-here.com/image.jpg",
    authorFirstName: "Hassan" // Must match an existing user's firstName
  },
  {
    type: 'video',
    caption: "Your custom video caption here",
    mediaUrl: "https://your-supabase-url-here.com/video.mp4",
    authorFirstName: "Lea"
  },
  {
    type: 'blog',
    caption: "Your custom blog title here",
    content: `Your blog content goes here. You can write multiple paragraphs.

This is a second paragraph with more content.

And a third paragraph if needed.`,
    authorFirstName: "Fatima"
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

// Create custom posts
async function createMyCustomPosts() {
  try {
    console.log('Creating custom posts...');
    const createdPosts = await createCustomPosts(customPosts);
    
    console.log('\n=== Custom Posts Created ===');
    console.log(`Total custom posts created: ${createdPosts.length}`);
    
    console.log('\nCreated posts:');
    createdPosts.forEach(post => {
      console.log(`- [${post.type.toUpperCase()}] "${post.caption}"`);
    });
    
  } catch (error) {
    console.error('Error creating custom posts:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

// Function to create a single post
async function createSinglePost(postData) {
  try {
    await connectDB();
    const createdPosts = await createCustomPosts([postData]);
    console.log('Single post created successfully!');
    return createdPosts[0];
  } catch (error) {
    console.error('Error creating single post:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
}

// Example usage functions
async function createImagePost() {
  const imagePost = {
    type: 'image',
    caption: "Amazing sunset at the beach!",
    mediaUrl: "https://your-supabase-url-here.com/sunset.jpg",
    authorFirstName: "Hassan"
  };
  
  return await createSinglePost(imagePost);
}

async function createVideoPost() {
  const videoPost = {
    type: 'video',
    caption: "Check out this amazing drone footage!",
    mediaUrl: "https://your-supabase-url-here.com/drone-video.mp4",
    authorFirstName: "Lea"
  };
  
  return await createSinglePost(videoPost);
}

async function createBlogPost() {
  const blogPost = {
    type: 'blog',
    caption: "My thoughts on technology",
    content: `Technology is changing our world at an incredible pace. Every day, new innovations emerge that reshape how we live, work, and connect with each other.

I've been thinking about how social media affects our relationships. While it connects us globally, it can sometimes isolate us locally. The key is finding balance.

What are your thoughts on the role of technology in modern relationships?`,
    authorFirstName: "Fatima"
  };
  
  return await createSinglePost(blogPost);
}

// Run the custom post creation
if (require.main === module) {
  connectDB().then(createMyCustomPosts);
}

module.exports = {
  createMyCustomPosts,
  createSinglePost,
  createImagePost,
  createVideoPost,
  createBlogPost,
  customPosts
}; 