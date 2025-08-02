import Notification from '../models/Notification.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, isRead } = req.query;
  
  // Build filter
  const filter = { recipient: req.user.id };
  
  if (type) {
    filter.type = type;
  }
  
  if (isRead !== undefined) {
    filter.isRead = isRead === 'true';
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get notifications with pagination
  const notifications = await Notification.find(filter)
    .populate('relatedTicket', 'ticketId title status priority')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({ 
    recipient: req.user.id, 
    isRead: false 
  });

  res.json({
    success: true,
    data: {
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      },
      unreadCount
    }
  });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  // Check if notification belongs to user
  if (notification.recipient.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this notification'
    });
  }

  notification.isRead = true;
  await notification.save();

  res.json({
    success: true,
    message: 'Notification marked as read',
    data: {
      notification
    }
  });
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/mark-all-read
 * @access  Private
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { isRead: true }
  );

  res.json({
    success: true,
    message: `${result.modifiedCount} notifications marked as read`,
    data: {
      modifiedCount: result.modifiedCount
    }
  });
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  // Check if notification belongs to user
  if (notification.recipient.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this notification'
    });
  }

  await notification.deleteOne();

  res.json({
    success: true,
    message: 'Notification deleted successfully'
  });
});

/**
 * @desc    Delete all read notifications
 * @route   DELETE /api/notifications/clear-read
 * @access  Private
 */
export const clearReadNotifications = asyncHandler(async (req, res) => {
  const result = await Notification.deleteMany({
    recipient: req.user.id,
    isRead: true
  });

  res.json({
    success: true,
    message: `${result.deletedCount} read notifications cleared`,
    data: {
      deletedCount: result.deletedCount
    }
  });
});

/**
 * @desc    Get notification stats
 * @route   GET /api/notifications/stats
 * @access  Private
 */
export const getNotificationStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const stats = await Notification.aggregate([
    { $match: { recipient: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
        read: { $sum: { $cond: [{ $eq: ['$isRead', true] }, 1, 0] } },
        byType: {
          $push: {
            type: '$type',
            isRead: '$isRead'
          }
        }
      }
    }
  ]);

  // Process type statistics
  const typeStats = {};
  if (stats[0] && stats[0].byType) {
    stats[0].byType.forEach(item => {
      if (!typeStats[item.type]) {
        typeStats[item.type] = { total: 0, unread: 0 };
      }
      typeStats[item.type].total++;
      if (!item.isRead) {
        typeStats[item.type].unread++;
      }
    });
  }

  const result = stats[0] || { total: 0, unread: 0, read: 0 };
  
  res.json({
    success: true,
    data: {
      total: result.total,
      unread: result.unread,
      read: result.read,
      typeStats
    }
  });
});

/**
 * @desc    Create notification (Admin/System use)
 * @route   POST /api/notifications
 * @access  Private (Admin)
 */
export const createNotification = asyncHandler(async (req, res) => {
  const { 
    recipient, 
    title, 
    message, 
    type = 'system', 
    priority = 'medium',
    relatedTicket,
    actionUrl,
    metadata 
  } = req.body;

  // Validate required fields
  if (!recipient || !title || !message) {
    return res.status(400).json({
      success: false,
      message: 'Recipient, title, and message are required'
    });
  }

  const notification = await Notification.create({
    recipient,
    title,
    message,
    type,
    priority,
    relatedTicket,
    actionUrl,
    metadata
  });

  await notification.populate('relatedTicket', 'ticketId title status priority');

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: {
      notification
    }
  });
});
