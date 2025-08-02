import express from 'express';
import {
  getDashboardStats,
  getTicketAnalytics,
  getPerformanceMetrics
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// Dashboard stats (accessible to all authenticated users)
router.get('/stats', getDashboardStats);

// Analytics and performance (admin/agent only)
router.get('/analytics', authorize('admin', 'agent'), getTicketAnalytics);
router.get('/performance', authorize('admin', 'agent'), getPerformanceMetrics);

export default router;
