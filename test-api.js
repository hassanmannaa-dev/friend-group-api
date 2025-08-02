const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Test user credentials
const testUser = {
  firstName: 'Alice',
  password: 'password123'
};

async function testAPI() {
  console.log('🧪 Testing Friend Group API...\n');

  try {
    // Test 1: Login
    console.log('1. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    authToken = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log(`   User: ${loginResponse.data.user.firstName} ${loginResponse.data.user.lastName}\n`);

    // Test 2: Get current user profile
    console.log('2. Testing get profile...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile retrieved successfully\n');

    // Test 3: Get all users
    console.log('3. Testing get all users...');
    const usersResponse = await axios.get(`${BASE_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Retrieved ${usersResponse.data.users.length} users\n`);

    // Test 4: Create a blog post
    console.log('4. Testing create blog post...');
    const blogPost = {
      caption: 'My first blog post',
      content: 'This is a test blog post content. Hello world!'
    };
    const blogResponse = await axios.post(`${BASE_URL}/posts/blog`, blogPost, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    const postId = blogResponse.data.post._id;
    console.log('✅ Blog post created successfully\n');

    // Test 5: Get all posts
    console.log('5. Testing get all posts...');
    const postsResponse = await axios.get(`${BASE_URL}/posts`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Retrieved ${postsResponse.data.posts.length} posts\n`);

    // Test 6: Like the post
    console.log('6. Testing like post...');
    const likeResponse = await axios.post(`${BASE_URL}/posts/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Post liked successfully\n');

    // Test 7: Add a comment
    console.log('7. Testing add comment...');
    const commentData = {
      content: 'This is a test comment!'
    };
    const commentResponse = await axios.post(`${BASE_URL}/posts/${postId}/comments`, commentData, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Comment added successfully\n');

    // Test 8: Get single post with comments
    console.log('8. Testing get single post...');
    const singlePostResponse = await axios.get(`${BASE_URL}/posts/${postId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Single post retrieved successfully');
    console.log(`   Post has ${singlePostResponse.data.post.comments.length} comments`);
    console.log(`   Post has ${singlePostResponse.data.post.likes.length} likes\n`);

    console.log('🎉 All tests passed! The API is working correctly.');
    console.log('\n📝 API Summary:');
    console.log('   - Authentication: ✅');
    console.log('   - User management: ✅');
    console.log('   - Blog posts: ✅');
    console.log('   - Likes: ✅');
    console.log('   - Comments: ✅');
    console.log('   - Post retrieval: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:5000/health');
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Server is running\n');
  await testAPI();
}

main(); 