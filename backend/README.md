# QuickDesk Backend

Express.js backend for the QuickDesk help desk system.

## 🚀 Features

- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with role-based access control
- **File Upload** support with Multer
- **Email Notifications** with Nodemailer
- **Input Validation** with Joi
- **Error Handling** middleware
- **Rate Limiting** for security
- **CORS** configuration

## 📦 Dependencies

### Production Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "joi": "^17.9.2",
  "multer": "^1.4.5-lts.1",
  "nodemailer": "^6.9.4",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.10.0",
  "dotenv": "^16.3.1"
}
```

### Development Dependencies
```json
{
  "nodemon": "^3.0.1"
}
```

## 🛠️ Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quickdesk
   JWT_SECRET=your_super_secret_jwt_key_here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:5173
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📊 Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ['user', 'agent', 'admin']),
  phone: String,
  department: String,
  avatar: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Ticket Model
```javascript
{
  title: String (required),
  description: String (required),
  status: String (enum: ['open', 'in-progress', 'resolved', 'closed']),
  priority: String (enum: ['low', 'medium', 'high', 'urgent']),
  category: ObjectId (ref: Category),
  user: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  attachments: [String],
  comments: [{
    user: ObjectId,
    message: String,
    isInternal: Boolean,
    createdAt: Date
  }],
  rating: Number,
  ratingComment: String,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model
```javascript
{
  name: String (required, unique),
  description: String,
  color: String,
  isActive: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
{
  id: user._id,
  email: user.email,
  role: user.role,
  iat: issuedAt,
  exp: expiresAt
}
```

### Role Permissions
- **User**: Create/view own tickets, add comments
- **Agent**: Manage all tickets, assign tickets, create categories
- **Admin**: Full system access, user management

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /profile` - Update profile
- `PUT /change-password` - Change password
- `POST /forgot-password` - Request password reset
- `PUT /reset-password/:token` - Reset password

### Ticket Routes (`/api/tickets`)
- `GET /` - Get tickets (with filtering)
- `GET /:id` - Get ticket by ID
- `POST /` - Create new ticket
- `PUT /:id` - Update ticket
- `DELETE /:id` - Delete ticket (Admin only)
- `POST /:id/comments` - Add comment
- `POST /:id/rate` - Rate ticket
- `GET /stats` - Get statistics

### User Routes (`/api/users`) - Admin Only
- `GET /` - Get all users
- `GET /:id` - Get user by ID
- `POST /` - Create user
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user
- `GET /agents` - Get agents
- `GET /stats` - Get user statistics

### Category Routes (`/api/categories`)
- `GET /` - Get categories
- `GET /:id` - Get category by ID
- `POST /` - Create category (Agent/Admin)
- `PUT /:id` - Update category (Agent/Admin)
- `DELETE /:id` - Delete category (Admin)
- `GET /stats` - Get category statistics

## 🛡️ Security Features

### Authentication Middleware
```javascript
// Protect routes requiring authentication
app.use('/api/protected', authMiddleware);

// Admin-only routes
app.use('/api/admin', [authMiddleware, adminMiddleware]);
```

### Input Validation
All endpoints use Joi validation schemas:
```javascript
const ticketSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  description: Joi.string().required().min(10),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  category: Joi.string().required()
});
```

### File Upload Security
- File type validation
- File size limits
- Secure filename generation
- Storage in uploads directory

## 📧 Email Notifications

### Notification Types
- **New Ticket**: When user creates a ticket
- **Status Update**: When ticket status changes
- **Assignment**: When ticket is assigned to agent
- **Resolution**: When ticket is resolved
- **New Comment**: When comment is added

### Email Templates
Located in `utils/emailTemplates.js`:
- Welcome email for new users
- Ticket creation confirmation
- Status update notifications
- Password reset emails

## 🔧 Configuration

### Environment Variables
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/quickdesk

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Database Connection
```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
```

## 🧪 Testing

### Manual Testing
Use tools like Postman or Thunder Client:

1. **Register a user**
   ```json
   POST /api/auth/register
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login**
   ```json
   POST /api/auth/login
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Create a ticket**
   ```json
   POST /api/tickets
   Headers: { Authorization: "Bearer <token>" }
   {
     "title": "Login Issue",
     "description": "Cannot login to the system",
     "priority": "high",
     "category": "<category_id>"
   }
   ```

## 📝 Error Handling

### Custom Error Classes
```javascript
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "stack": "Error stack (development only)"
  }
}
```

## 📈 Performance

### Database Optimization
- Indexing on frequently queried fields
- Mongoose lean queries for read operations
- Pagination for large datasets
- Connection pooling

### Caching
- Consider implementing Redis for session storage
- Cache frequently accessed categories
- API response caching for statistics

## 🔄 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set secure JWT secret
- [ ] Configure email service
- [ ] Set up file storage (AWS S3, etc.)
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up SSL certificates
- [ ] Configure monitoring and logging

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection Failed**
   - Check MongoDB service is running
   - Verify MONGODB_URI in .env

2. **JWT Token Invalid**
   - Check JWT_SECRET in .env
   - Verify token format in Authorization header

3. **Email Not Sending**
   - Verify email credentials
   - Check firewall/network settings
   - Enable "Less secure app access" for Gmail

4. **File Upload Errors**
   - Check file size limits
   - Verify allowed file types
   - Ensure uploads directory exists

### Logging
```javascript
// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});
```
