import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Upload single file
 * @route   POST /api/upload/single
 * @access  Private
 */
export const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const fileInfo = {
    originalName: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
    path: req.file.path,
    url: `/uploads/${req.file.filename}`
  };

  res.json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      file: fileInfo
    }
  });
});

/**
 * @desc    Upload multiple files
 * @route   POST /api/upload/multiple
 * @access  Private
 */
export const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded'
    });
  }

  const filesInfo = req.files.map(file => ({
    originalName: file.originalname,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype,
    path: file.path,
    url: `/uploads/${file.filename}`
  }));

  res.json({
    success: true,
    message: `${req.files.length} files uploaded successfully`,
    data: {
      files: filesInfo
    }
  });
});

/**
 * @desc    Get file
 * @route   GET /api/upload/file/:filename
 * @access  Private
 */
export const getFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }

  // Get file stats
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;

  // Set appropriate headers
  res.set({
    'Content-Length': fileSize,
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${filename}"`
  });

  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

/**
 * @desc    Delete file
 * @route   DELETE /api/upload/file/:filename
 * @access  Private
 */
export const deleteFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }

  try {
    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file'
    });
  }
});

/**
 * @desc    Get file info
 * @route   GET /api/upload/info/:filename
 * @access  Private
 */
export const getFileInfo = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }

  const stats = fs.statSync(filePath);
  
  const fileInfo = {
    filename,
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime,
    url: `/uploads/${filename}`
  };

  res.json({
    success: true,
    data: {
      file: fileInfo
    }
  });
});

/**
 * @desc    Get upload statistics
 * @route   GET /api/upload/stats
 * @access  Private (Admin)
 */
export const getUploadStats = asyncHandler(async (req, res) => {
  const uploadsDir = path.join(__dirname, '../uploads');

  if (!fs.existsSync(uploadsDir)) {
    return res.json({
      success: true,
      data: {
        totalFiles: 0,
        totalSize: 0,
        fileTypes: {}
      }
    });
  }

  const files = fs.readdirSync(uploadsDir);
  let totalSize = 0;
  const fileTypes = {};

  files.forEach(filename => {
    const filePath = path.join(uploadsDir, filename);
    const stats = fs.statSync(filePath);
    
    totalSize += stats.size;
    
    const ext = path.extname(filename).toLowerCase();
    fileTypes[ext] = (fileTypes[ext] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      totalFiles: files.length,
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      fileTypes
    }
  });
});

/**
 * @desc    Cleanup old files
 * @route   DELETE /api/upload/cleanup
 * @access  Private (Admin)
 */
export const cleanupOldFiles = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const uploadsDir = path.join(__dirname, '../uploads');
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  if (!fs.existsSync(uploadsDir)) {
    return res.json({
      success: true,
      message: 'Uploads directory does not exist',
      data: { deletedCount: 0 }
    });
  }

  const files = fs.readdirSync(uploadsDir);
  let deletedCount = 0;

  files.forEach(filename => {
    const filePath = path.join(uploadsDir, filename);
    const stats = fs.statSync(filePath);
    
    if (stats.mtime < cutoffDate) {
      try {
        fs.unlinkSync(filePath);
        deletedCount++;
      } catch (error) {
        console.error(`Error deleting file ${filename}:`, error);
      }
    }
  });

  res.json({
    success: true,
    message: `Cleanup completed. ${deletedCount} files deleted.`,
    data: {
      deletedCount,
      cutoffDate
    }
  });
});
