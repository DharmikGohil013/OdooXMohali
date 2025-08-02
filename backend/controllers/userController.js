import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import mongoose from 'mongoose';

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};
  
  // Filter by role
  if (req.query.role) {
    query.role = req.query.role;
  }

  // Filter by active status
  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  }

  // Search by name or email
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-password -resetPasswordToken -resetPasswordExpire')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  // Add ticket counts for each user
  const usersWithTicketCounts = await Promise.all(
    users.map(async (user) => {
      const [totalTickets, openTickets, resolvedTickets] = await Promise.all([
        Ticket.countDocuments({ createdBy: user._id }),
        Ticket.countDocuments({ createdBy: user._id, status: { $in: ['open', 'in-progress'] } }),
        Ticket.countDocuments({ createdBy: user._id, status: 'resolved' })
      ]);

      return {
        ...user,
        ticketStats: {
          total: totalTickets,
          open: openTickets,
          resolved: resolvedTickets
        }
      };
    })
  );

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: {
      users: usersWithTicketCounts,
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
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -resetPasswordToken -resetPasswordExpire')
    .lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get user's ticket summary
  const [ticketStats, recentTickets] = await Promise.all([
    Ticket.aggregate([
      { $match: { createdBy: user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
        }
      }
    ]),
    
    Ticket.find({ createdBy: user._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(3)
      .select('_id ticketId title status priority createdAt')
      .lean()
  ]);

  const stats = ticketStats[0] || {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  };

  res.json({
    success: true,
    data: {
      user: {
        ...user,
        ticketStats: {
          total: stats.total,
          open: stats.open,
          inProgress: stats.inProgress,
          pending: stats.open + stats.inProgress,
          resolved: stats.resolved,
          closed: stats.closed
        }
      },
      recentTickets: recentTickets || []
    }
  });
});

/**
 * @desc    Create new user (Admin only)
 * @route   POST /api/users
 * @access  Private/Admin
 */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, phone } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    department,
    phone
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: user.getPublicProfile()
    }
  });
});

/**
 * @desc    Update user (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, department, phone, isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if email is being changed and if it already exists
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
  }

  // Update fields
  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.department = department || user.department;
  user.phone = phone || user.phone;
  
  if (isActive !== undefined) {
    user.isActive = isActive;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: updatedUser.getPublicProfile()
    }
  });
});

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account'
    });
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

/**
 * @desc    Get agents for ticket assignment
 * @route   GET /api/users/agents
 * @access  Private
 */
export const getAgents = asyncHandler(async (req, res) => {
  const agents = await User.find({
    role: { $in: ['agent', 'admin'] },
    isActive: true
  })
    .select('name email role department')
    .sort({ name: 1 });

  res.json({
    success: true,
    data: {
      agents
    }
  });
});

/**
 * @desc    Get user statistics (Admin only)
 * @route   GET /api/users/stats
 * @access  Private/Admin
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });

  // Format stats
  const roleStats = {};
  stats.forEach(stat => {
    roleStats[stat._id] = stat.count;
  });

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      inactiveUsers,
      roleStats
    }
  });
});

/**
 * @desc    Activate/Deactivate user (Admin only)
 * @route   PUT /api/users/:id/toggle-status
 * @access  Private/Admin
 */
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Don't allow deactivating admins
  if (user.role === 'admin' && user.isActive) {
    return res.status(400).json({
      success: false,
      message: 'Cannot deactivate admin users'
    });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: {
      user: user.getPublicProfile()
    }
  });
});

/**
 * @desc    Change user role (Admin only)
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
export const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['user', 'agent', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be user, agent, or admin'
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Don't allow changing your own role
  if (user._id.toString() === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot change your own role'
    });
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: 'User role updated successfully',
    data: {
      user: user.getPublicProfile()
    }
  });
});

/**
 * @desc    Get user activity/tickets
 * @route   GET /api/users/:id/activity
 * @access  Private/Admin
 */
export const getUserActivity = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Import here to avoid circular dependency
  const Ticket = (await import('../models/Ticket.js')).default;

  const [
    ticketsCreated,
    ticketsAssigned,
    ticketsResolved,
    recentActivity
  ] = await Promise.all([
    // Tickets created by user
    Ticket.countDocuments({ createdBy: userId }),
    
    // Tickets assigned to user (for agents)
    Ticket.countDocuments({ assignedTo: userId }),
    
    // Tickets resolved by user
    Ticket.countDocuments({ resolvedBy: userId }),
    
    // Recent tickets (created or assigned)
    Ticket.find({
      $or: [
        { createdBy: userId },
        { assignedTo: userId }
      ]
    })
    .populate('category', 'name color')
    .sort({ updatedAt: -1 })
    .limit(10)
    .select('ticketId title status priority createdAt updatedAt')
  ]);

  res.json({
    success: true,
    data: {
      user: user.getPublicProfile(),
      activity: {
        ticketsCreated,
        ticketsAssigned,
        ticketsResolved,
        recentActivity
      }
    }
  });
});

/**
 * @desc    Reset user password (Admin only)
 * @route   PUT /api/users/:id/reset-password
 * @access  Private/Admin
 */
export const resetUserPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

/**
 * @desc    Get all tickets for a specific user (Admin only)
 * @route   GET /api/users/:id/tickets
 * @access  Private/Admin
 */
export const getUserTickets = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  
  // Validate user ID format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID format'
    });
  }

  // Check if user exists
  const user = await User.findById(userId).select('name email role department');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query for user's tickets
  let query = { createdBy: userId };

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

  // Search in title and description
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { ticketId: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Sort options
  let sortOption = { createdAt: -1 }; // Default: newest first
  if (req.query.sortBy) {
    switch (req.query.sortBy) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'updated':
        sortOption = { updatedAt: -1 };
        break;
      case 'priority':
        sortOption = { priority: 1, createdAt: -1 };
        break;
      case 'status':
        sortOption = { status: 1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  }

  const [tickets, total, ticketStats] = await Promise.all([
    // Get tickets with pagination
    Ticket.find(query)
      .populate('assignedTo', 'name email role')
      .sort(sortOption)
      .limit(limit)
      .skip(skip)
      .select('_id ticketId title description status priority category createdAt updatedAt attachments tags')
      .lean(),
    
    // Get total count
    Ticket.countDocuments(query),
    
    // Get user's ticket statistics
    Ticket.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } }
        }
      }
    ])
  ]);

  const stats = ticketStats[0] || {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    urgent: 0,
    high: 0
  };

  res.json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      },
      tickets,
      stats: {
        total: stats.total,
        open: stats.open,
        inProgress: stats.inProgress,
        pending: stats.open + stats.inProgress,
        resolved: stats.resolved,
        closed: stats.closed,
        urgent: stats.urgent,
        high: stats.high
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        status: req.query.status || null,
        priority: req.query.priority || null,
        category: req.query.category || null,
        search: req.query.search || null,
        sortBy: req.query.sortBy || 'newest'
      }
    }
  });
});

/**
 * @desc    Get user ticket summary (Admin only)
 * @route   GET /api/users/:id/tickets/summary
 * @access  Private/Admin
 */
export const getUserTicketSummary = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  
  // Validate user ID format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID format'
    });
  }

  // Check if user exists
  const user = await User.findById(userId).select('name email role department createdAt');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const [ticketStats, recentTickets, categoryBreakdown] = await Promise.all([
    // Overall ticket statistics
    Ticket.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
        }
      }
    ]),

    // Recent tickets (last 5)
    Ticket.find({ createdBy: userId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id ticketId title status priority category createdAt')
      .lean(),

    // Tickets by category
    Ticket.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])
  ]);

  const stats = ticketStats[0] || {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    urgent: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  res.json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        memberSince: user.createdAt
      },
      summary: {
        totalTickets: stats.total,
        statusBreakdown: {
          open: stats.open,
          inProgress: stats.inProgress,
          pending: stats.open + stats.inProgress,
          resolved: stats.resolved,
          closed: stats.closed
        },
        priorityBreakdown: {
          urgent: stats.urgent,
          high: stats.high,
          medium: stats.medium,
          low: stats.low
        },
        categoryBreakdown: categoryBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        resolutionRate: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0
      },
      recentTickets: recentTickets || []
    }
  });
});
