import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  
  try {
    let stats = {};

    if (userRole === 'admin' || userRole === 'agent') {
      // Admin/Agent dashboard stats
      const [
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        totalUsers,
        totalCategories,
        urgentTickets,
        ticketsByStatus,
        ticketsByPriority,
        recentTickets,
        ticketTrends
      ] = await Promise.all([
        // Total tickets
        Ticket.countDocuments(),
        
        // Open tickets
        Ticket.countDocuments({ status: 'open' }),
        
        // In progress tickets
        Ticket.countDocuments({ status: 'in-progress' }),
        
        // Resolved tickets
        Ticket.countDocuments({ status: 'resolved' }),
        
        // Total users
        User.countDocuments({ role: 'user' }),
        
        // Total categories
        Category.countDocuments(),
        
        // Urgent tickets
        Ticket.countDocuments({ priority: 'urgent', status: { $ne: 'resolved' } }),
        
        // Tickets by status
        Ticket.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),
        
        // Tickets by priority
        Ticket.aggregate([
          {
            $group: {
              _id: '$priority',
              count: { $sum: 1 }
            }
          }
        ]),
        
        // Recent tickets (last 5)
        Ticket.find()
          .populate('createdBy', 'name email')
          .populate('category', 'name color')
          .sort({ createdAt: -1 })
          .limit(5)
          .select('ticketId title status priority createdAt'),
        
        // Ticket trends (last 7 days)
        Ticket.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
              },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ])
      ]);

      stats = {
        overview: {
          totalTickets,
          openTickets,
          inProgressTickets,
          resolvedTickets,
          totalUsers,
          totalCategories,
          urgentTickets
        },
        distribution: {
          byStatus: ticketsByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          byPriority: ticketsByPriority.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        recentActivity: recentTickets,
        trends: ticketTrends
      };

    } else {
      // User dashboard stats
      const [
        myTickets,
        myOpenTickets,
        myInProgressTickets,
        myResolvedTickets,
        myTicketsByStatus,
        myRecentTickets
      ] = await Promise.all([
        // My total tickets
        Ticket.countDocuments({ createdBy: userId }),
        
        // My open tickets
        Ticket.countDocuments({ createdBy: userId, status: 'open' }),
        
        // My in progress tickets
        Ticket.countDocuments({ createdBy: userId, status: 'in-progress' }),
        
        // My resolved tickets
        Ticket.countDocuments({ createdBy: userId, status: 'resolved' }),
        
        // My tickets by status
        Ticket.aggregate([
          { $match: { createdBy: userId } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),
        
        // My recent tickets
        Ticket.find({ createdBy: userId })
          .populate('category', 'name color')
          .populate('assignedTo', 'name')
          .sort({ createdAt: -1 })
          .limit(5)
          .select('ticketId title status priority createdAt')
      ]);

      stats = {
        overview: {
          myTickets,
          myOpenTickets,
          myInProgressTickets,
          myResolvedTickets
        },
        distribution: {
          byStatus: myTicketsByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        recentActivity: myRecentTickets
      };
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
});

/**
 * @desc    Get ticket analytics
 * @route   GET /api/dashboard/analytics
 * @access  Private (Admin/Agent)
 */
export const getTicketAnalytics = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query; // days
  const days = parseInt(period);
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const analytics = await Promise.all([
    // Tickets created over time
    Ticket.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          created: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]),

    // Tickets resolved over time
    Ticket.aggregate([
      {
        $match: {
          updatedAt: { $gte: startDate },
          status: 'resolved'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
          },
          resolved: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]),

    // Average resolution time
    Ticket.aggregate([
      {
        $match: {
          status: 'resolved',
          updatedAt: { $gte: startDate }
        }
      },
      {
        $addFields: {
          resolutionTime: {
            $subtract: ["$updatedAt", "$createdAt"]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResolutionTime: { $avg: "$resolutionTime" },
          count: { $sum: 1 }
        }
      }
    ]),

    // Tickets by category
    Ticket.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          categoryName: { $first: { $arrayElemAt: ['$categoryInfo.name', 0] } }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])
  ]);

  res.json({
    success: true,
    data: {
      period: `${days} days`,
      ticketsCreated: analytics[0],
      ticketsResolved: analytics[1],
      avgResolutionTime: analytics[2][0] || { avgResolutionTime: 0, count: 0 },
      ticketsByCategory: analytics[3]
    }
  });
});

/**
 * @desc    Get performance metrics
 * @route   GET /api/dashboard/performance
 * @access  Private (Admin/Agent)
 */
export const getPerformanceMetrics = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [currentPeriod, previousPeriod] = await Promise.all([
    // Current period (last 30 days)
    Ticket.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: 1 },
          resolvedTickets: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          urgentTickets: {
            $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] }
          }
        }
      }
    ]),

    // Previous period (30-60 days ago)
    Ticket.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            $lt: thirtyDaysAgo
          }
        }
      },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: 1 },
          resolvedTickets: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          urgentTickets: {
            $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] }
          }
        }
      }
    ])
  ]);

  const current = currentPeriod[0] || { totalTickets: 0, resolvedTickets: 0, urgentTickets: 0 };
  const previous = previousPeriod[0] || { totalTickets: 0, resolvedTickets: 0, urgentTickets: 0 };

  // Calculate percentage changes
  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  res.json({
    success: true,
    data: {
      metrics: {
        totalTickets: {
          current: current.totalTickets,
          previous: previous.totalTickets,
          change: calculateChange(current.totalTickets, previous.totalTickets)
        },
        resolvedTickets: {
          current: current.resolvedTickets,
          previous: previous.resolvedTickets,
          change: calculateChange(current.resolvedTickets, previous.resolvedTickets)
        },
        urgentTickets: {
          current: current.urgentTickets,
          previous: previous.urgentTickets,
          change: calculateChange(current.urgentTickets, previous.urgentTickets)
        },
        resolutionRate: {
          current: current.totalTickets > 0 ? ((current.resolvedTickets / current.totalTickets) * 100).toFixed(1) : 0,
          previous: previous.totalTickets > 0 ? ((previous.resolvedTickets / previous.totalTickets) * 100).toFixed(1) : 0
        }
      }
    }
  });
});
