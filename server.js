require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// Import models for seeding
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again later.'
//   }
// });
// app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }
  
  if (error.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Seed initial users function
async function seedUsers() {
  try {
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      const users = [
        {
          firstName: 'Alice',
          lastName: 'Johnson',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          password: 'password123'
        },
        {
          firstName: 'Bob',
          lastName: 'Smith',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          password: 'password123'
        },
        {
          firstName: 'Carol',
          lastName: 'Davis',
          avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          password: 'password123'
        },
        {
          firstName: 'David',
          lastName: 'Wilson',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          password: 'password123'
        }
      ];

      await User.insertMany(users);
      console.log('✅ Initial users seeded successfully');
    } else {
      console.log('✅ Users already exist, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Seed users after database connection
    // await seedUsers();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 API Documentation:`);
      console.log(`   POST /api/auth/login - Login with firstName and password`);
      console.log(`   GET  /api/auth/me - Get current user profile`);
      console.log(`   GET  /api/auth/users - Get all users`);
      console.log(`   POST /api/posts/blog - Create blog post`);
      console.log(`   POST /api/posts/image - Upload image with caption`);
      console.log(`   POST /api/posts/video - Upload video with caption`);
      console.log(`   GET  /api/posts - Get all posts (paginated)`);
      console.log(`   GET  /api/posts/:id - Get single post`);
      console.log(`   POST /api/posts/:id/like - Like/unlike post`);
      console.log(`   POST /api/posts/:id/comments - Add comment`);
      console.log(`   DELETE /api/posts/:id - Delete post (author only)`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

startServer(); 