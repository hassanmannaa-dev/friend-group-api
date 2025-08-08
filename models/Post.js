const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'blog'],
    required: true
  },
  caption: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  content: {
    type: String,
    required: false
  },
  tags: {
    type: [String],
    default: [],
    set: function(raw) {
      if (!raw) return [];
      const toArray = Array.isArray(raw) ? raw : [raw];
      const normalized = toArray
        .map(t => (t == null ? '' : String(t)))
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);
      return Array.from(new Set(normalized));
    }
  },
  mediaUrl: {
    // For images and videos, this will contain the Supabase URL
    type: String,
    required: function() {
      return this.type === 'image' || this.type === 'video';
    }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index tags for efficient lookup by tag
postSchema.index({ tags: 1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Method to check if user has liked the post
postSchema.methods.hasUserLiked = function(userId) {
  return this.likes.includes(userId);
};

// Method to toggle like
postSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.indexOf(userId);
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
  } else {
    this.likes.push(userId);
  }
  return this.save();
};

// Ensure virtuals are included in JSON output
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema); 