import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAgents,
  getUserStats,
  toggleUserStatus,
  changeUserRole,
  getUserActivity,
  resetUserPassword
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Public agent list (for ticket assignment)
router.get('/agents', getAgents);

// Admin only routes
router.get('/stats', authorize('admin'), getUserStats);
router.get('/', authorize('admin'), getUsers);
router.post('/', authorize('admin'), createUser);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

// Additional admin user management routes
router.put('/:id/toggle-status', authorize('admin'), toggleUserStatus);
router.put('/:id/role', authorize('admin'), changeUserRole);
router.get('/:id/activity', authorize('admin'), getUserActivity);
router.put('/:id/reset-password', authorize('admin'), resetUserPassword);

export default router;
