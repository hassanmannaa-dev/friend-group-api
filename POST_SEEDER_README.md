# Post Seeder Documentation

This project includes multiple post seeders to help you populate your database with sample posts. Each seeder serves different purposes and offers different levels of customization.

## Available Seeders

### 1. `seed-posts.js` - Basic Random Seeder
Creates posts with random user assignments.

**Features:**
- Creates 5 image posts, 5 video posts, and 5 blog posts
- Randomly assigns posts to existing users
- Uses sample Supabase URLs
- Includes sample content for all post types

**Usage:**
```bash
node seed-posts.js
```

### 2. `seed-posts-advanced.js` - Advanced Seeder with User Assignments
Creates posts with specific user assignments and detailed statistics.

**Features:**
- Assigns specific posts to specific users
- Provides detailed statistics on post distribution per user
- Includes comprehensive sample content
- Better error handling and reporting

**Usage:**
```bash
node seed-posts-advanced.js
```

### 3. `create-custom-posts.js` - Custom Post Creator
Allows you to easily create your own custom posts with specific URLs and user assignments.

**Features:**
- Create posts with your own Supabase URLs
- Assign posts to specific users by firstName
- Create single posts or batches
- Modular functions for different post types

**Usage:**
```bash
node create-custom-posts.js
```

## How to Use with Your Own Data

### Option 1: Modify the Custom Posts Array

Edit the `customPosts` array in `create-custom-posts.js`:

```javascript
const customPosts = [
  {
    type: 'image',
    caption: "Your custom image caption here",
    mediaUrl: "https://your-supabase-url-here.com/image.jpg",
    authorFirstName: "Hassan" // Must match existing user
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

This is a second paragraph with more content.`,
    authorFirstName: "Fatima"
  }
];
```

### Option 2: Use the Modular Functions

```javascript
const { createImagePost, createVideoPost, createBlogPost } = require('./create-custom-posts');

// Create individual posts
await createImagePost();
await createVideoPost();
await createBlogPost();
```

### Option 3: Create Single Posts Programmatically

```javascript
const { createSinglePost } = require('./create-custom-posts');

const myPost = {
  type: 'image',
  caption: "My custom post",
  mediaUrl: "https://your-supabase-url.com/image.jpg",
  authorFirstName: "Hassan"
};

await createSinglePost(myPost);
```

## Post Types and Requirements

### Image Posts
```javascript
{
  type: 'image',
  caption: "Your caption here",
  mediaUrl: "https://your-supabase-url.com/image.jpg",
  authorFirstName: "UserFirstName"
}
```

### Video Posts
```javascript
{
  type: 'video',
  caption: "Your caption here",
  mediaUrl: "https://your-supabase-url.com/video.mp4",
  authorFirstName: "UserFirstName"
}
```

### Blog Posts
```javascript
{
  type: 'blog',
  caption: "Your blog title",
  content: `Your blog content here. Can be multiple paragraphs.

Second paragraph here.`,
  authorFirstName: "UserFirstName"
}
```

## Important Notes

1. **User Requirements**: Make sure you have users seeded first using `seed.js`
2. **User Matching**: The `authorFirstName` must exactly match an existing user's firstName
3. **URL Format**: Use your actual Supabase URLs for media files
4. **Content Length**: Captions are limited to 1000 characters
5. **Database Connection**: Ensure your MongoDB connection is properly configured

## Available Users (from seed.js)

- **Hassan** - firstName: "Hassan"
- **Lea** - firstName: "Lea"  
- **Fatima** - firstName: "Fatima"
- **Karim** - firstName: "Karim"

## Running the Seeders

1. **First, seed users:**
   ```bash
   node seed.js
   ```

2. **Then run any post seeder:**
   ```bash
   # Basic random seeder
   node seed-posts.js
   
   # Advanced seeder with user assignments
   node seed-posts-advanced.js
   
   # Custom posts (edit the array first)
   node create-custom-posts.js
   ```

## Example Output

```
Connected to MongoDB
Cleared existing posts

Seeding posts with specific user assignments...
Created image post: "Beautiful sunset at the beach today! 🌅..." by Hassan Mannaa
Created video post: "Amazing drone footage of the city skyline! 🚁..." by Lea Khalife
Created blog post: "My thoughts on sustainable living..." by Fatima Slim

=== Seeding Summary ===
Total posts created: 15

=== User Post Distribution ===
Hassan: 3 posts (2 images, 0 videos, 1 blogs)
Lea: 3 posts (1 images, 2 videos, 0 blogs)
Fatima: 3 posts (1 images, 1 videos, 1 blogs)
Karim: 3 posts (1 images, 1 videos, 1 blogs)

Database connection closed
```

## Troubleshooting

- **"User not found" error**: Make sure you've run `seed.js` first
- **"MongoDB connection error"**: Check your `.env` file and MongoDB connection
- **"Validation error"**: Check that your post data matches the required schema
- **"Duplicate key error"**: The seeder clears existing posts, but check for any unique constraints

## Customization Tips

1. **Add more post types**: Modify the arrays in the seeders
2. **Change user assignments**: Update the `authorFirstName` fields
3. **Add your own URLs**: Replace the sample Supabase URLs with your actual URLs
4. **Create different content**: Write your own captions and blog content
5. **Add more users**: First add users to `seed.js`, then reference them in post seeders 