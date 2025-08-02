import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

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
    .skip(skip);

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: {
      users,
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
    .select('-password -resetPasswordToken -resetPasswordExpire');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: {
      user
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
