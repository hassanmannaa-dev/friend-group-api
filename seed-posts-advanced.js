const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Post = require('./models/Post');

// Advanced post data with user assignments
const postAssignments = [
  // Image posts
  {
    type: 'image',
    caption: "Beautiful sunset at the beach today! 🌅",
    mediaUrl: "https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/posts/images/sunset-beach.jpg",
    authorFirstName: "Hassan" // Will be matched to user
  },
  {
    type: 'image',
    caption: "Amazing mountain view from my hike 🏔️",
    mediaUrl: "https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/posts/images/mountain-hike.jpg",
    authorFirstName: "Lea"
  },
  {
    type: 'image',
    caption: "Coffee and good vibes ☕",
    mediaUrl: "https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/posts/images/coffee-vibes.jpg",
    authorFirstName: "Fatima"
  },
  {
    type: 'image',
    caption: "Street art in the city 🎨",
    mediaUrl: "https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/posts/images/street-art.jpg",
    authorFirstName: "Karim"
  },
  {
    type: 'image',
    caption: "My new plant collection 🌱",
    mediaUrl: "https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/posts/images/plants.jpg",
    authorFirstName: "Hassan"
  },
  
  // Video posts
  {
    type: 'video',
    caption: "Amazing drone footage of the city skyline! 🚁",
    mediaUrl: "https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/posts/videos/drone-city.mp4",
    authorFirstName: "Lea"
  },
  {
    type: 'video',
    caption: "Cooking tutorial: How to make the perfect pasta 🍝",
    mediaUrl: "https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/posts/videos/cooking-pasta.mp4",
    authorFirstName: "Fatima"
  },
  {
    type: 'video',
    caption: "My morning workout routine 💪",
    mediaUrl: "https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/posts/videos/workout-routine.mp4",
    authorFirstName: "Karim"
  },
  {
    type: 'video',
    caption: "Travel vlog: Exploring the local market 🛍️",
    mediaUrl: "https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/posts/videos/travel-market.mp4",
    authorFirstName: "Hassan"
  },
  {
    type: 'video',
    caption: "Music session with friends 🎵",
    mediaUrl: "https://iruphyvegochwcbocjil.supabase.co/storage/v1/object/public/posts/videos/music-session.mp4",
    authorFirstName: "Lea"
  },
  
  // Blog posts
  {
    type: 'blog',
    caption: "My thoughts on sustainable living",
    content: `Living sustainably isn't just about recycling or using less plastic. It's about making conscious choices every day that benefit our planet and future generations.

I've been on this journey for the past year, and I've learned that small changes can make a big difference. From switching to reusable water bottles to supporting local farmers, every decision counts.

The most surprising thing I've discovered is how much money you can actually save by living more sustainably. Buying in bulk, growing your own herbs, and repairing instead of replacing have all helped me reduce my monthly expenses.

What sustainable practices have you adopted? I'd love to hear your experiences and tips!`,
    authorFirstName: "Fatima"
  },
  {
    type: 'blog',
    caption: "The art of mindful cooking",
    content: `Cooking has become my meditation. There's something therapeutic about chopping vegetables, measuring ingredients, and watching a dish come together.

I've learned that cooking mindfully means being present in the moment. It's not just about the end result, but the entire process. The sound of onions sizzling, the aroma of garlic and herbs, the feel of dough between your fingers.

My favorite part is sharing meals with friends and family. Food has this incredible power to bring people together, to create memories, and to show love.

Today I made my grandmother's pasta recipe. As I rolled the dough, I thought about all the times she taught me in her kitchen. Cooking connects us to our heritage, to our loved ones, and to ourselves.

What's your favorite recipe and the story behind it?`,
    authorFirstName: "Karim"
  },
  {
    type: 'blog',
    caption: "Digital nomad life: Lessons learned",
    content: `After two years of working remotely while traveling, I've learned some valuable lessons about the digital nomad lifestyle.

First, routine is everything. Even when you're in a new city every week, having a morning routine helps ground you. Mine includes meditation, journaling, and a good cup of coffee.

Second, community is crucial. It's easy to feel isolated when you're constantly on the move. I've found amazing communities through coworking spaces, local meetups, and online groups.

Third, slow travel is the way to go. Spending at least a month in each place allows you to truly experience the culture, make local friends, and avoid burnout.

The biggest challenge? Maintaining relationships back home. Technology helps, but nothing replaces face-to-face time with loved ones.

Would you ever consider the digital nomad lifestyle? What concerns do you have?`,
    authorFirstName: "Hassan"
  },
  {
    type: 'blog',
    caption: "Mental health in the digital age",
    content: `Social media is a double-edged sword. While it connects us globally, it can also isolate us locally and impact our mental health.

I've been working on my relationship with technology, and here's what I've learned:

1. Set boundaries: No phone in the bedroom, no social media for the first hour of the day
2. Curate your feed: Unfollow accounts that make you feel bad about yourself
3. Take regular breaks: I do a 24-hour digital detox every Sunday
4. Practice gratitude: Instead of comparing my life to others', I focus on what I'm grateful for

The most important lesson? Real connection happens offline. I've made it a priority to have at least one meaningful conversation with a friend or family member every day.

How do you maintain a healthy relationship with social media?`,
    authorFirstName: "Lea"
  },
  {
    type: 'blog',
    caption: "The power of small habits",
    content: `They say it takes 21 days to form a habit, but I've found that the most impactful changes come from tiny, consistent actions.

My morning routine is simple: 10 minutes of meditation, 5 minutes of journaling, and a glass of water. It's not much, but it sets the tone for my entire day.

I've also learned that tracking helps. I use a simple habit tracker in my journal, and seeing those checkmarks builds momentum.

The key is starting small. Want to read more? Start with 5 minutes a day. Want to exercise? Begin with a 10-minute walk. Want to learn a language? Practice for just 5 minutes daily.

Small actions compound over time. What small habit would you like to build?`,
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

// Find user by first name
async function findUserByFirstName(firstName) {
  const user = await User.findOne({ firstName, isActive: true });
  if (!user) {
    throw new Error(`User with firstName "${firstName}" not found. Please run the user seeder first.`);
  }
  return user;
}

// Seed posts with specific user assignments
async function seedPostsWithAssignments() {
  const createdPosts = [];
  const userStats = {};
  
  for (const postData of postAssignments) {
    try {
      const author = await findUserByFirstName(postData.authorFirstName);
      
      // Initialize user stats if not exists
      if (!userStats[author.firstName]) {
        userStats[author.firstName] = { image: 0, video: 0, blog: 0 };
      }
      
      const post = new Post({
        author: author._id,
        type: postData.type,
        caption: postData.caption,
        content: postData.type === 'blog' ? postData.content : undefined,
        mediaUrl: postData.type !== 'blog' ? postData.mediaUrl : undefined,
        likes: [],
        comments: [],
        isActive: true
      });
      
      const savedPost = await post.save();
      createdPosts.push(savedPost);
      
      // Update user stats
      userStats[author.firstName][postData.type]++;
      
      console.log(`Created ${postData.type} post: "${postData.caption.substring(0, 50)}..." by ${author.fullName}`);
      
    } catch (error) {
      console.error(`Error creating post "${postData.caption}":`, error.message);
    }
  }
  
  return { createdPosts, userStats };
}

// Seed the database
async function seedPostsAdvanced() {
  try {
    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    console.log('\nSeeding posts with specific user assignments...');
    const { createdPosts, userStats } = await seedPostsWithAssignments();

    console.log('\n=== Seeding Summary ===');
    console.log(`Total posts created: ${createdPosts.length}`);
    
    console.log('\n=== User Post Distribution ===');
    Object.entries(userStats).forEach(([firstName, stats]) => {
      const total = stats.image + stats.video + stats.blog;
      console.log(`${firstName}: ${total} posts (${stats.image} images, ${stats.video} videos, ${stats.blog} blogs)`);
    });

    // Display sample posts by type
    const imagePosts = createdPosts.filter(p => p.type === 'image');
    const videoPosts = createdPosts.filter(p => p.type === 'video');
    const blogPosts = createdPosts.filter(p => p.type === 'blog');
    
    console.log('\n=== Posts by Type ===');
    console.log(`Image posts: ${imagePosts.length}`);
    console.log(`Video posts: ${videoPosts.length}`);
    console.log(`Blog posts: ${blogPosts.length}`);

    console.log('\nSample posts created:');
    createdPosts.slice(0, 8).forEach(post => {
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

// Function to create custom posts with your own data
async function createCustomPosts(customPostData) {
  try {
    const createdPosts = [];
    
    for (const postData of customPostData) {
      const author = await findUserByFirstName(postData.authorFirstName);
      
      const post = new Post({
        author: author._id,
        type: postData.type,
        caption: postData.caption,
        content: postData.type === 'blog' ? postData.content : undefined,
        mediaUrl: postData.type !== 'blog' ? postData.mediaUrl : undefined,
        likes: [],
        comments: [],
        isActive: true
      });
      
      const savedPost = await post.save();
      createdPosts.push(savedPost);
      
      console.log(`Created custom ${postData.type} post: "${postData.caption.substring(0, 50)}..." by ${author.fullName}`);
    }
    
    return createdPosts;
  } catch (error) {
    console.error('Error creating custom posts:', error);
    throw error;
  }
}

// Run the seeding
if (require.main === module) {
  connectDB().then(seedPostsAdvanced);
}

module.exports = { 
  seedPostsAdvanced, 
  createCustomPosts, 
  postAssignments,
  findUserByFirstName 
}; 