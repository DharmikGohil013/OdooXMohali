import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import database connection
import connectDB from './config/db.js';

// Import models for seeding
import Category from './models/Category.js';
import User from './models/User.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Get current directory (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Connect to database
connectDB();

// Seed default categories function
const seedDefaultCategories = async () => {
  try {
    const categoriesCount = await Category.countDocuments();
    
    if (categoriesCount === 0) {
      console.log('🌱 Seeding default categories...');
      
      // Find an admin user to assign as creator, or create system user
      let adminUser = await User.findOne({ role: 'admin' });
      
      if (!adminUser) {
        // Create a system admin user for category creation
        adminUser = await User.create({
          name: 'System Admin',
          email: 'admin@quickdesk.com',
          password: 'admin123', // This will be hashed by the model
          role: 'admin'
        });
        console.log('📧 System admin user created: admin@quickdesk.com (password: admin123)');
      }
      
      const defaultCategories = [
        {
          name: 'Technical Support',
          description: 'Hardware, software, and system-related issues',
          color: '#3b82f6',
          createdBy: adminUser._id
        },
        {
          name: 'Account & Billing',
          description: 'Account access, billing questions, and payment issues',
          color: '#10b981',
          createdBy: adminUser._id
        },
        {
          name: 'Bug Report',
          description: 'Report software bugs and unexpected behavior',
          color: '#ef4444',
          createdBy: adminUser._id
        },
        {
          name: 'Feature Request',
          description: 'Suggest new features and improvements',
          color: '#8b5cf6',
          createdBy: adminUser._id
        },
        {
          name: 'General Inquiry',
          description: 'General questions and information requests',
          color: '#f59e0b',
          createdBy: adminUser._id
        },
        {
          name: 'Security',
          description: 'Security-related concerns and incidents',
          color: '#dc2626',
          createdBy: adminUser._id
        },
        {
          name: 'Training & Documentation',
          description: 'Training requests and documentation issues',
          color: '#059669',
          createdBy: adminUser._id
        },
        {
          name: 'Integration Support',
          description: 'API and third-party integration assistance',
          color: '#7c3aed',
          createdBy: adminUser._id
        }
      ];
      
      await Category.insertMany(defaultCategories);
      console.log('✅ Default categories seeded successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding default categories:', error);
  }
};

// Initialize application
const initializeApp = async () => {
  // Seed default categories
  await seedDefaultCategories();
};

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests, or Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://localhost:8080',
      'http://127.0.0.1:8080'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS - Origin:', origin);
      callback(null, true); // Allow all origins for development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files middleware (for file uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'QuickDesk API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Documentation route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to QuickDesk API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      categories: '/api/categories',
      tickets: '/api/tickets',
      notifications: '/api/notifications',
      dashboard: '/api/dashboard',
      upload: '/api/upload'
    },
    documentation: 'https://documenter.getpostman.com/view/your-postman-collection'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);

// Handle 404 errors
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, async () => {
  console.log(`🚀 QuickDesk Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  
  // Initialize application data
  await initializeApp();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;
