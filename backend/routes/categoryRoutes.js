import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  bulkUpdateCategories
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Public routes (all authenticated users)
router.get('/', getCategories);
router.get('/stats', getCategoryStats);
router.get('/:id', getCategoryById);

// Admin/Agent only routes
router.post('/', authorize('admin', 'agent'), createCategory);
router.put('/bulk', authorize('admin'), bulkUpdateCategories);
router.put('/:id', authorize('admin', 'agent'), updateCategory);
router.delete('/:id', authorize('admin'), deleteCategory);

export default router;
