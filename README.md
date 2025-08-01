# Friend Group Social Media API

A minimal social media API built with Express.js and MongoDB, designed for a small group of 4 fixed users.

## Features

- **Authentication**: JWT-based authentication for fixed users
- **Content Types**: Support for images, videos, and blog posts
- **Social Features**: Like posts and add comments
- **Media Upload**: Integration with Supabase for media storage
- **Security**: Rate limiting, CORS, and input validation

## Tech Stack

- **Backend**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Supabase Storage
- **Security**: Helmet, Rate Limiting, CORS
- **Validation**: Express-validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Supabase account (for media storage)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd friend-group-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/friend-group-api
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3000
   NODE_ENV=development
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   SUPABASE_BUCKET_NAME=media-uploads
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Create a storage bucket named `media-uploads`
   - Set bucket permissions to allow authenticated uploads
   - Copy your project URL and keys to `.env`

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Database Schema

### Users
- `firstName` (String, required)
- `lastName` (String, required)
- `avatarUrl` (String, required)
- `password` (String, hashed)
- `isActive` (Boolean, default: true)
- `createdAt`, `updatedAt` (timestamps)

### Posts
- `author` (ObjectId, ref: User)
- `type` (String, enum: ['image', 'video', 'blog'])
- `caption` (String, required)
- `content` (String, required)
- `mediaUrl` (String, for images/videos)
- `likes` (Array of ObjectIds, ref: User)
- `comments` (Array of ObjectIds, ref: Comment)
- `isActive` (Boolean, default: true)
- `createdAt`, `updatedAt` (timestamps)

### Comments
- `post` (ObjectId, ref: Post)
- `author` (ObjectId, ref: User)
- `content` (String, required)
- `isActive` (Boolean, default: true)
- `createdAt`, `updatedAt` (timestamps)

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Login with firstName and password.

**Request Body:**
```json
{
  "firstName": "Alice",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "firstName": "Alice",
    "lastName": "Johnson",
    "avatarUrl": "https://...",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/auth/me`
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

#### GET `/api/auth/users`
Get all users (requires authentication).

### Posts

#### POST `/api/posts/blog`
Create a blog post (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "caption": "My first blog post",
  "content": "This is the content of my blog post..."
}
```

#### POST `/api/posts/image`
Upload an image with caption (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Request Body:**
```
image: <file>
caption: "My awesome photo"
```

#### POST `/api/posts/video`
Upload a video with caption (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Request Body:**
```
video: <file>
caption: "My awesome video"
```

#### GET `/api/posts`
Get all posts with pagination (requires authentication).

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)

#### GET `/api/posts/:postId`
Get a single post by ID (requires authentication).

#### POST `/api/posts/:postId/like`
Like or unlike a post (requires authentication).

#### POST `/api/posts/:postId/comments`
Add a comment to a post (requires authentication).

**Request Body:**
```json
{
  "content": "Great post!"
}
```

#### DELETE `/api/posts/:postId`
Delete a post (only by author, requires authentication).

## Initial Users

The API automatically creates 4 users on first run:

1. **Alice Johnson** - `password123`
2. **Bob Smith** - `password123`
3. **Carol Davis** - `password123`
4. **David Wilson** - `password123`

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Express-validator for all inputs
- **CORS Protection**: Configurable origins
- **Helmet**: Security headers
- **File Upload Limits**: 50MB max file size
- **File Type Validation**: Only images and videos allowed

## Media Upload Flow

1. **Client uploads file** to `/api/posts/image` or `/api/posts/video`
2. **Multer** processes the file in memory
3. **Supabase Service** uploads to Supabase Storage
4. **Post is created** with the media URL
5. **Response includes** the complete post data

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // for validation errors
}
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Testing the API
You can test the API using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

### Example curl commands

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Alice", "password": "password123"}'
```

**Create blog post:**
```bash
curl -X POST http://localhost:3000/api/posts/blog \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"caption": "My blog", "content": "Blog content"}'
```

## Production Considerations

1. **Environment Variables**: Use strong JWT secrets
2. **Database**: Use MongoDB Atlas or similar cloud service
3. **Media Storage**: Configure Supabase with proper CORS
4. **Rate Limiting**: Adjust based on your needs
5. **Logging**: Add proper logging (Winston, etc.)
6. **Monitoring**: Add health checks and monitoring
7. **SSL**: Use HTTPS in production

## License

MIT License 