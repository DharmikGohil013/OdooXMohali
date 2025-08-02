import express from 'express';
import {
  uploadSingle,
  uploadMultiple,
  getFile,
  deleteFile,
  getFileInfo,
  getUploadStats,
  cleanupOldFiles
} from '../controllers/uploadController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadSingle as uploadSingleMiddleware, uploadMultiple as uploadMultipleMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Upload routes
router.post('/single', uploadSingleMiddleware('file'), uploadSingle);
router.post('/multiple', uploadMultipleMiddleware('files', 10), uploadMultiple);

// File management routes
router.get('/file/:filename', getFile);
router.delete('/file/:filename', deleteFile);
router.get('/info/:filename', getFileInfo);

// Admin routes
router.get('/stats', authorize('admin'), getUploadStats);
router.delete('/cleanup', authorize('admin'), cleanupOldFiles);

export default router;
