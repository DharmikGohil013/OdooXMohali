import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';
import { sendTicketNotification } from '../utils/sendEmail.js';
import { notifyTicketParticipants } from '../utils/notificationService.js';
import { deleteFile } from '../middleware/uploadMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import fs from 'fs';

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
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .populate('category', 'name description color')
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
    .populate('createdBy', 'name email role department')
    .populate('assignedTo', 'name email role department')
    .populate('category', 'name description color')
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
  const { subject, description, priority, category } = req.body;

  // Validate required fields
  if (!subject || !subject.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Ticket subject is required and cannot be empty'
    });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Ticket description is required and cannot be empty'
    });
  }

  if (!category) {
    return res.status(400).json({
      success: false,
      message: 'Please select a category for your ticket'
    });
  }

  // Validate subject length
  if (subject.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Ticket subject must be at least 5 characters long'
    });
  }

  if (subject.trim().length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Ticket subject cannot exceed 200 characters'
    });
  }

  // Validate description length
  if (description.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Ticket description must be at least 10 characters long'
    });
  }

  if (description.trim().length > 5000) {
    return res.status(400).json({
      success: false,
      message: 'Ticket description cannot exceed 5000 characters'
    });
  }

  // Validate priority
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  const ticketPriority = priority || 'medium';
  
  if (!validPriorities.includes(ticketPriority)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid priority. Must be one of: low, medium, high, urgent'
    });
  }

  // Validate category by checking if it exists in database
  if (!category || !category.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please select a category for your ticket'
    });
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(category.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category format'
    });
  }

  // Check if category exists and is active
  const categoryExists = await Category.findOne({ 
    _id: category.trim(), 
    isActive: true 
  });

  if (!categoryExists) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category. Please select a valid category.'
    });
  }

  // Handle file attachments with detailed validation
  let attachments = [];
  let uploadErrors = [];

  if (req.files && req.files.length > 0) {
    // Validate file count
    if (req.files.length > 5) {
      // Clean up uploaded files
      req.files.forEach(file => {
        try {
          deleteFile(file.path);
        } catch (error) {
          console.error('Error deleting file during cleanup:', error);
        }
      });
      
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 files allowed per ticket'
      });
    }

    // Process each file
    for (const file of req.files) {
      try {
        // Validate file size (5MB = 5 * 1024 * 1024 bytes)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          uploadErrors.push(`File "${file.originalname}" exceeds 5MB limit`);
          deleteFile(file.path);
          continue;
        }

        // Validate file type
        const allowedMimeTypes = [
          // Images
          'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
          // Documents
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain',
          'text/csv'
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          uploadErrors.push(`File "${file.originalname}" has unsupported format. Only images and documents are allowed`);
          deleteFile(file.path);
          continue;
        }

        // Validate file extension
        const allowedExtensions = [
          '.jpg', '.jpeg', '.png', '.gif', '.webp',
          '.pdf', '.doc', '.docx', '.xls', '.xlsx', 
          '.ppt', '.pptx', '.txt', '.csv'
        ];
        
        const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
        if (!allowedExtensions.includes(fileExtension)) {
          uploadErrors.push(`File "${file.originalname}" has unsupported extension`);
          deleteFile(file.path);
          continue;
        }

        // Check if file exists on disk
        if (!fs.existsSync(file.path)) {
          uploadErrors.push(`File "${file.originalname}" was not saved properly. Please try again`);
          continue;
        }

        // File is valid, add to attachments
        attachments.push({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimeType: file.mimetype,
          url: `/uploads/${file.filename}`,
          uploadedAt: new Date()
        });

      } catch (error) {
        console.error('Error processing file:', error);
        uploadErrors.push(`Error processing file "${file.originalname}": ${error.message}`);
        try {
          deleteFile(file.path);
        } catch (deleteError) {
          console.error('Error deleting file during error cleanup:', deleteError);
        }
      }
    }

    // If there were upload errors, return them
    if (uploadErrors.length > 0) {
      // Clean up any successfully uploaded files
      attachments.forEach(attachment => {
        try {
          deleteFile(attachment.path);
        } catch (error) {
          console.error('Error cleaning up files:', error);
        }
      });

      return res.status(400).json({
        success: false,
        message: 'File upload failed',
        errors: uploadErrors
      });
    }
  }

  try {
    // Generate unique ticket ID
    const ticketCount = await Ticket.countDocuments();
    const today = new Date();
    const dateString = today.getFullYear().toString() + 
                      (today.getMonth() + 1).toString().padStart(2, '0') + 
                      today.getDate().toString().padStart(2, '0');
    const ticketId = `TKT-${dateString}-${(ticketCount + 1).toString().padStart(3, '0')}`;

    console.log('Generated ticketId:', ticketId); // Debug log

    // Create the ticket
    const ticket = await Ticket.create({
      ticketId: ticketId,
      title: subject.trim(),
      description: description.trim(),
      priority: ticketPriority,
      category: category.trim(),
      createdBy: req.user.id,
      attachments,
      status: 'open'
    });

    // Populate the ticket with user data and category
    await ticket.populate([
      { path: 'createdBy', select: 'name email role department' },
      { path: 'category', select: 'name description color' }
    ]);

    // Send notification email (don't wait for it)
    try {
      await sendTicketNotification(ticket, 'created');
    } catch (error) {
      console.error('Error sending ticket notification email:', error);
    }

    // Create in-app notifications
    try {
      await notifyTicketParticipants(ticket, 'ticket_created', req.user.id);
    } catch (error) {
      console.error('Error creating in-app notifications:', error);
    }

    // Prepare response with file information
    const responseData = {
      ticket: {
        _id: ticket._id,
        ticketId: ticket.ticketId,
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        category: ticket.category,
        createdBy: ticket.createdBy,
        attachments: ticket.attachments.map(attachment => ({
          filename: attachment.filename,
          originalName: attachment.originalName,
          size: attachment.size,
          mimeType: attachment.mimeType,
          url: attachment.url,
          uploadedAt: attachment.uploadedAt
        })),
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      }
    };

    // Add upload summary to response
    if (attachments.length > 0) {
      responseData.uploadSummary = {
        totalFiles: attachments.length,
        totalSize: attachments.reduce((sum, file) => sum + file.size, 0),
        files: attachments.map(file => ({
          name: file.originalName,
          size: file.size,
          type: file.mimeType
        }))
      };
    }

    res.status(201).json({
      success: true,
      message: attachments.length > 0 
        ? `Ticket created successfully with ${attachments.length} file(s) uploaded`
        : 'Ticket created successfully',
      data: responseData
    });

  } catch (error) {
    // Clean up uploaded files if ticket creation fails
    attachments.forEach(attachment => {
      try {
        deleteFile(attachment.path);
      } catch (deleteError) {
        console.error('Error cleaning up files after ticket creation failure:', deleteError);
      }
    });

    console.error('Error creating ticket:', error);
    
    // Handle specific database errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Ticket validation failed',
        errors: validationErrors
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create ticket. Please try again later'
    });
  }
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

    // Create in-app notifications
    try {
      const notificationTypeApp = updatedTicket.status === 'resolved' ? 'ticket_resolved' : 'ticket_updated';
      await notifyTicketParticipants(updatedTicket, notificationTypeApp, req.user.id);
    } catch (error) {
      console.error('Error creating in-app notifications:', error);
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

/**
 * @desc    Assign ticket to agent
 * @route   PUT /api/tickets/:id/assign
 * @access  Private (Admin/Agent)
 */
export const assignTicket = asyncHandler(async (req, res) => {
  const { assignedTo } = req.body;

  const ticket = await Ticket.findById(req.params.id);
  
  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }

  // Verify assignedTo user exists and is agent/admin
  if (assignedTo) {
    const agent = await User.findById(assignedTo);
    if (!agent || (agent.role !== 'agent' && agent.role !== 'admin')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent assignment'
      });
    }
  }

  const oldAssignedTo = ticket.assignedTo;
  ticket.assignedTo = assignedTo;
  ticket.status = 'in-progress';
  
  await ticket.save();
  
  await ticket.populate([
    { path: 'category', select: 'name color' },
    { path: 'createdBy', select: 'name email role department' },
    { path: 'assignedTo', select: 'name email role department' }
  ]);

  // Create notification for newly assigned agent
  if (assignedTo && (!oldAssignedTo || oldAssignedTo.toString() !== assignedTo.toString())) {
    try {
      await notifyTicketParticipants(ticket, 'ticket_assigned', req.user.id);
    } catch (error) {
      console.error('Error creating assignment notification:', error);
    }
  }

  res.json({
    success: true,
    message: 'Ticket assigned successfully',
    data: { ticket }
  });
});

/**
 * @desc    Close ticket
 * @route   PUT /api/tickets/:id/close
 * @access  Private (Admin/Agent or Ticket Owner)
 */
export const closeTicket = asyncHandler(async (req, res) => {
  const { resolution } = req.body;

  const ticket = await Ticket.findById(req.params.id);
  
  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }

  // Check authorization
  if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to close this ticket'
    });
  }

  ticket.status = 'resolved';
  ticket.resolution = resolution;
  ticket.resolvedAt = new Date();
  ticket.resolvedBy = req.user.id;

  await ticket.save();

  await ticket.populate([
    { path: 'category', select: 'name color' },
    { path: 'createdBy', select: 'name email role department' },
    { path: 'assignedTo', select: 'name email role department' },
    { path: 'resolvedBy', select: 'name email role department' }
  ]);

  // Send notifications
  try {
    await sendTicketNotification(ticket, 'resolved');
    await notifyTicketParticipants(ticket, 'ticket_resolved', req.user.id);
  } catch (error) {
    console.error('Error sending resolution notifications:', error);
  }

  res.json({
    success: true,
    message: 'Ticket closed successfully',
    data: { ticket }
  });
});

/**
 * @desc    Reopen ticket
 * @route   PUT /api/tickets/:id/reopen
 * @access  Private
 */
export const reopenTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  
  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }

  // Check authorization
  if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to reopen this ticket'
    });
  }

  if (ticket.status !== 'resolved') {
    return res.status(400).json({
      success: false,
      message: 'Only resolved tickets can be reopened'
    });
  }

  ticket.status = 'open';
  ticket.resolution = null;
  ticket.resolvedAt = null;
  ticket.resolvedBy = null;

  await ticket.save();

  await ticket.populate([
    { path: 'category', select: 'name color' },
    { path: 'createdBy', select: 'name email role department' },
    { path: 'assignedTo', select: 'name email role department' }
  ]);

  // Send notifications
  try {
    await notifyTicketParticipants(ticket, 'ticket_updated', req.user.id);
  } catch (error) {
    console.error('Error sending reopen notifications:', error);
  }

  res.json({
    success: true,
    message: 'Ticket reopened successfully',
    data: { ticket }
  });
});
