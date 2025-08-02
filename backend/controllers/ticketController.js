import Ticket from '../models/Ticket.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import { sendTicketNotification } from '../utils/sendEmail.js';
import { deleteFile } from '../middleware/uploadMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get all tickets
 * @route   GET /api/tickets
 * @access  Private
 */
export const getTickets = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query based on user role
  let query = {};

  // If user is not admin/agent, only show their tickets
  if (req.user.role === 'user') {
    query.createdBy = req.user.id;
  }

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by priority
  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by assigned agent
  if (req.query.assignedTo) {
    query.assignedTo = req.query.assignedTo;
  }

  // Filter tickets assigned to current user (for agents)
  if (req.query.myTickets === 'true' && ['agent', 'admin'].includes(req.user.role)) {
    query.assignedTo = req.user.id;
  }

  // Search in title and description
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { ticketId: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    query.createdAt = {};
    if (req.query.startDate) {
      query.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      query.createdAt.$lte = new Date(req.query.endDate);
    }
  }

  const tickets = await Ticket.find(query)
    .populate('category', 'name color')
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Ticket.countDocuments(query);

  res.json({
    success: true,
    data: {
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

/**
 * @desc    Get ticket by ID
 * @route   GET /api/tickets/:id
 * @access  Private
 */
export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('category', 'name color')
    .populate('createdBy', 'name email role department')
    .populate('assignedTo', 'name email role department')
    .populate('comments.author', 'name email role');

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }

  // Check permissions
  if (req.user.role === 'user' && ticket.createdBy._id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only view your own tickets.'
    });
  }

  // Filter internal comments for non-agents
  if (req.user.role === 'user') {
    ticket.comments = ticket.comments.filter(comment => !comment.isInternal);
  }

  res.json({
    success: true,
    data: {
      ticket
    }
  });
});

/**
 * @desc    Create new ticket
 * @route   POST /api/tickets
 * @access  Private
 */
export const createTicket = asyncHandler(async (req, res) => {
  const { title, description, priority, category, tags, dueDate } = req.body;

  // Validate category exists
  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category'
    });
  }

  // Prepare attachments if files were uploaded
  let attachments = [];
  if (req.files && req.files.length > 0) {
    attachments = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimeType: file.mimetype
    }));
  }

  const ticket = await Ticket.create({
    title,
    description,
    priority: priority || 'medium',
    category,
    createdBy: req.user.id,
    attachments,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    dueDate: dueDate ? new Date(dueDate) : null
  });

  // Populate the ticket
  await ticket.populate([
    { path: 'category', select: 'name color' },
    { path: 'createdBy', select: 'name email role department' }
  ]);

  // Send notification email (don't wait for it)
  try {
    await sendTicketNotification(ticket, 'created');
  } catch (error) {
    console.error('Error sending ticket notification:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Ticket created successfully',
    data: {
      ticket
    }
  });
});

/**
 * @desc    Update ticket
 * @route   PUT /api/tickets/:id
 * @access  Private
 */
export const updateTicket = asyncHandler(async (req, res) => {
  const { title, description, priority, status, assignedTo, tags, dueDate, resolution } = req.body;

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }

  // Check permissions
  const isOwner = ticket.createdBy.toString() === req.user.id;
  const isAssigned = ticket.assignedTo && ticket.assignedTo.toString() === req.user.id;
  const isAgentOrAdmin = ['agent', 'admin'].includes(req.user.role);

  if (!isOwner && !isAssigned && !isAgentOrAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only update your own tickets or assigned tickets.'
    });
  }

  // Users can only update title, description, and priority of their own open tickets
  if (req.user.role === 'user' && isOwner) {
    if (ticket.status !== 'open') {
      return res.status(403).json({
        success: false,
        message: 'You can only edit open tickets.'
      });
    }
    // Only allow certain fields for users
    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;
    ticket.priority = priority || ticket.priority;
    if (tags) {
      ticket.tags = tags.split(',').map(tag => tag.trim());
    }
  } else if (isAgentOrAdmin || isAssigned) {
    // Agents and admins can update all fields
    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;
    ticket.priority = priority || ticket.priority;
    ticket.status = status || ticket.status;
    ticket.dueDate = dueDate ? new Date(dueDate) : ticket.dueDate;
    ticket.resolution = resolution || ticket.resolution;
    
    if (tags) {
      ticket.tags = tags.split(',').map(tag => tag.trim());
    }
    
    // Validate assignedTo user
    if (assignedTo && assignedTo !== ticket.assignedTo?.toString()) {
      const assignee = await User.findOne({
        _id: assignedTo,
        role: { $in: ['agent', 'admin'] },
        isActive: true
      });
      
      if (!assignee) {
        return res.status(400).json({
          success: false,
          message: 'Invalid assignee. User must be an active agent or admin.'
        });
      }
      
      ticket.assignedTo = assignedTo;
    }
  }

  const oldStatus = ticket.status;
  const updatedTicket = await ticket.save();

  // Populate the ticket
  await updatedTicket.populate([
    { path: 'category', select: 'name color' },
    { path: 'createdBy', select: 'name email role department' },
    { path: 'assignedTo', select: 'name email role department' }
  ]);

  // Send notification if status changed
  if (oldStatus !== updatedTicket.status) {
    try {
      const notificationType = updatedTicket.status === 'resolved' ? 'resolved' : 'updated';
      await sendTicketNotification(updatedTicket, notificationType);
    } catch (error) {
      console.error('Error sending ticket notification:', error);
    }
  }

  res.json({
    success: true,
    message: 'Ticket updated successfully',
    data: {
      ticket: updatedTicket
    }
  });
});

/**
 * @desc    Delete ticket
 * @route   DELETE /api/tickets/:id
 * @access  Private/Admin
 */
export const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }

  // Delete associated files
  if (ticket.attachments && ticket.attachments.length > 0) {
    ticket.attachments.forEach(attachment => {
      deleteFile(attachment.path);
    });
  }

  await Ticket.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Ticket deleted successfully'
  });
});

/**
 * @desc    Add comment to ticket
 * @route   POST /api/tickets/:id/comments
 * @access  Private
 */
export const addComment = asyncHandler(async (req, res) => {
  const { content, isInternal } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      message: 'Comment content is required'
    });
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }

  // Check permissions
  const isOwner = ticket.createdBy.toString() === req.user.id;
  const isAssigned = ticket.assignedTo && ticket.assignedTo.toString() === req.user.id;
  const isAgentOrAdmin = ['agent', 'admin'].includes(req.user.role);

  if (!isOwner && !isAssigned && !isAgentOrAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only comment on your own tickets or assigned tickets.'
    });
  }

  // Only agents and admins can add internal comments
  const commentIsInternal = isInternal && isAgentOrAdmin;

  const comment = {
    content,
    author: req.user.id,
    isInternal: commentIsInternal,
    createdAt: new Date()
  };

  ticket.comments.push(comment);
  const updatedTicket = await ticket.save();

  // Populate the new comment
  await updatedTicket.populate('comments.author', 'name email role');

  // Get the newly added comment
  const newComment = updatedTicket.comments[updatedTicket.comments.length - 1];

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: {
      comment: newComment
    }
  });
});

/**
 * @desc    Rate ticket (satisfaction rating)
 * @route   POST /api/tickets/:id/rate
 * @access  Private
 */
export const rateTicket = asyncHandler(async (req, res) => {
  const { rating, feedback } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }

  // Only ticket owner can rate
  if (ticket.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Only the ticket creator can rate the ticket'
    });
  }

  // Only resolved or closed tickets can be rated
  if (!['resolved', 'closed'].includes(ticket.status)) {
    return res.status(400).json({
      success: false,
      message: 'Only resolved or closed tickets can be rated'
    });
  }

  ticket.satisfactionRating = {
    rating,
    feedback: feedback || '',
    ratedAt: new Date()
  };

  const updatedTicket = await ticket.save();

  res.json({
    success: true,
    message: 'Ticket rated successfully',
    data: {
      rating: updatedTicket.satisfactionRating
    }
  });
});

/**
 * @desc    Get ticket statistics
 * @route   GET /api/tickets/stats
 * @access  Private
 */
export const getTicketStats = asyncHandler(async (req, res) => {
  // Build base query for user role
  let baseQuery = {};
  if (req.user.role === 'user') {
    baseQuery.createdBy = req.user.id;
  } else if (req.user.role === 'agent') {
    // Agents see all tickets or just assigned ones based on query
    if (req.query.onlyAssigned === 'true') {
      baseQuery.assignedTo = req.user.id;
    }
  }

  // Status statistics
  const statusStats = await Ticket.aggregate([
    { $match: baseQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Priority statistics
  const priorityStats = await Ticket.aggregate([
    { $match: baseQuery },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  // Monthly ticket creation stats (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyStats = await Ticket.aggregate([
    { 
      $match: { 
        ...baseQuery,
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Response time statistics (for resolved tickets)
  const responseTimeStats = await Ticket.aggregate([
    { 
      $match: { 
        ...baseQuery,
        status: 'resolved',
        resolvedAt: { $exists: true }
      }
    },
    {
      $addFields: {
        responseTime: {
          $divide: [
            { $subtract: ['$resolvedAt', '$createdAt'] },
            1000 * 60 * 60 // Convert to hours
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        avgResponseTime: { $avg: '$responseTime' },
        minResponseTime: { $min: '$responseTime' },
        maxResponseTime: { $max: '$responseTime' }
      }
    }
  ]);

  // Total counts
  const totalTickets = await Ticket.countDocuments(baseQuery);
  const openTickets = await Ticket.countDocuments({ ...baseQuery, status: 'open' });
  const resolvedTickets = await Ticket.countDocuments({ ...baseQuery, status: 'resolved' });

  // Format statistics
  const formattedStatusStats = {};
  statusStats.forEach(stat => {
    formattedStatusStats[stat._id] = stat.count;
  });

  const formattedPriorityStats = {};
  priorityStats.forEach(stat => {
    formattedPriorityStats[stat._id] = stat.count;
  });

  res.json({
    success: true,
    data: {
      totalTickets,
      openTickets,
      resolvedTickets,
      statusStats: formattedStatusStats,
      priorityStats: formattedPriorityStats,
      monthlyStats,
      responseTime: responseTimeStats[0] || {
        avgResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0
      }
    }
  });
});
