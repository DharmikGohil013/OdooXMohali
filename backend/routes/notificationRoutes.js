import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
  getNotificationStats,
  createNotification
} from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// User notification routes
router.get('/', getNotifications);
router.get('/stats', getNotificationStats);
router.put('/mark-all-read', markAllAsRead);
router.delete('/clear-read', clearReadNotifications);

// Individual notification routes
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// Admin routes
router.post('/', authorize('admin'), createNotification);

export default router;
