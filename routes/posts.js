const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const SupabaseService = require('../services/supabase');

const router = express.Router();

// Create a blog post
router.post('/blog', auth, [
  body('caption').trim().notEmpty().withMessage('Caption is required'),
  body('content').optional().trim(),
  body('tags').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { caption, content } = req.body;

    // Normalize tags: accept array, comma-separated string, or JSON string
    let tags = [];
    try {
      const rawTags = req.body.tags;
      if (typeof rawTags === 'string') {
        // Attempt JSON parse first
        try {
          const parsed = JSON.parse(rawTags);
          if (Array.isArray(parsed)) {
            tags = parsed;
          } else if (typeof parsed === 'string') {
            tags = parsed.split(',');
          } else {
            tags = [String(parsed)];
          }
        } catch (_) {
          // Fallback: comma-separated string
          tags = rawTags.split(',');
        }
      } else if (Array.isArray(rawTags)) {
        tags = rawTags;
      }
    } catch (_) {
      tags = [];
    }

    const post = new Post({
      author: req.user._id,
      type: 'blog',
      caption,
      content: content || '',
      tags
    });

    await post.save();

    // Populate author details
    await post.populate('author', 'firstName lastName avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      post
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload image with caption
router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const { caption } = req.body;

    // Normalize tags similar to blog
    let tags = [];
    try {
      const rawTags = req.body.tags;
      if (typeof rawTags === 'string') {
        try {
          const parsed = JSON.parse(rawTags);
          if (Array.isArray(parsed)) {
            tags = parsed;
          } else if (typeof parsed === 'string') {
            tags = parsed.split(',');
          } else {
            tags = [String(parsed)];
          }
        } catch (_) {
          tags = rawTags.split(',');
        }
      } else if (Array.isArray(rawTags)) {
        tags = rawTags;
      }
    } catch (_) {
      tags = [];
    }

    if (!caption) {
      return res.status(400).json({
        success: false,
        message: 'Caption is required'
      });
    }

    // Upload to Supabase
    const uploadResult = await SupabaseService.uploadMedia(req.file, req.file.originalname);

    if (!uploadResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: uploadResult.error
      });
    }

    const post = new Post({
      author: req.user._id,
      type: 'image',
      caption,
      content: uploadResult.url,
      mediaUrl: uploadResult.url,
      tags
    });

    await post.save();
    await post.populate('author', 'firstName lastName avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Image post created successfully',
      post
    });
  } catch (error) {
    console.error('Create image post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload video with caption
router.post('/video', auth, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Video file is required'
      });
    }

    const { caption } = req.body;

    // Normalize tags similar to blog
    let tags = [];
    try {
      const rawTags = req.body.tags;
      if (typeof rawTags === 'string') {
        try {
          const parsed = JSON.parse(rawTags);
          if (Array.isArray(parsed)) {
            tags = parsed;
          } else if (typeof parsed === 'string') {
            tags = parsed.split(',');
          } else {
            tags = [String(parsed)];
          }
        } catch (_) {
          tags = rawTags.split(',');
        }
      } else if (Array.isArray(rawTags)) {
        tags = rawTags;
      }
    } catch (_) {
      tags = [];
    }

    if (!caption) {
      return res.status(400).json({
        success: false,
        message: 'Caption is required'
      });
    }

    // Upload to Supabase
    const uploadResult = await SupabaseService.uploadMedia(req.file, req.file.originalname);

    if (!uploadResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload video',
        error: uploadResult.error
      });
    }

    const post = new Post({
      author: req.user._id,
      type: 'video',
      caption,
      content: uploadResult.url,
      mediaUrl: uploadResult.url,
      tags
    });

    await post.save();
    await post.populate('author', 'firstName lastName avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Video post created successfully',
      post
    });
  } catch (error) {
    console.error('Create video post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all posts with pagination
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isActive: true })
      .populate('author', 'firstName lastName avatarUrl')
      .populate('comments')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ isActive: true });

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get posts by type (image, video, blog)
router.get('/type/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate type parameter
    const validTypes = ['image', 'video', 'blog'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post type. Must be one of: image, video, blog'
      });
    }

    const posts = await Post.find({ 
      type: type,
      isActive: true 
    })
      .populate('author', 'firstName lastName avatarUrl')
      .populate('comments')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ 
      type: type,
      isActive: true 
    });

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get posts by tag with pagination
router.get('/tag/:tag', auth, async (req, res) => {
  try {
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const normalizedTag = String(tag).trim().toLowerCase();
    if (!normalizedTag) {
      return res.status(400).json({ success: false, message: 'Tag is required' });
    }

    const posts = await Post.find({ tags: normalizedTag, isActive: true })
      .populate('author', 'firstName lastName avatarUrl')
      .populate('comments')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ tags: normalizedTag, isActive: true });

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts by tag error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get single post by ID
router.get('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'firstName lastName avatarUrl')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'firstName lastName avatarUrl'
        }
      });

    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Like/unlike a post
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await post.toggleLike(req.user._id);
    
    // Fetch the updated post with populated author
    const updatedPost = await Post.findById(req.params.postId)
      .populate('author', 'firstName lastName avatarUrl');

    res.json({
      success: true,
      message: updatedPost.hasUserLiked(req.user._id) ? 'Post liked' : 'Post unliked',
      post: updatedPost
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add comment to a post
router.post('/:postId/comments', auth, [
  body('content').trim().notEmpty().withMessage('Comment content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const post = await Post.findById(req.params.postId);

    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = new Comment({
      post: post._id,
      author: req.user._id,
      content: req.body.content
    });

    await comment.save();
    await comment.populate('author', 'firstName lastName avatarUrl');

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete a post (only by author)
router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    // Soft delete
    post.isActive = false;
    await post.save();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 