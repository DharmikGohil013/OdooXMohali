import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Calculate storage usage from uploads directory
 */
const calculateStorageUsage = async () => {
  try {
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    
    if (!fs.existsSync(uploadsPath)) {
      return { totalSize: 0, fileCount: 0 };
    }

    const files = fs.readdirSync(uploadsPath);
    let totalSize = 0;
    let fileCount = 0;

    for (const file of files) {
      try {
        const filePath = path.join(uploadsPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          totalSize += stats.size;
          fileCount++;
        }
      } catch (error) {
        // Skip files that can't be accessed
        continue;
      }
    }

    return { 
      totalSize: Math.round(totalSize / (1024 * 1024) * 100) / 100, // MB with 2 decimal places
      fileCount,
      totalSizeBytes: totalSize
    };
  } catch (error) {
    console.error('Error calculating storage:', error);
    return { totalSize: 0, fileCount: 0, totalSizeBytes: 0 };
  }
};

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
        pendingTickets,
        resolvedTickets,
        closedTickets,
        totalUsers,
        activeUsers,
        urgentTickets,
        highPriorityTickets,
        ticketsByStatus,
        ticketsByPriority,
        ticketsByCategory,
        recentTickets,
        recentUsers,
        ticketTrends,
        storageInfo
      ] = await Promise.all([
        // Total tickets
        Ticket.countDocuments(),
        
        // Open tickets
        Ticket.countDocuments({ status: 'open' }),
        
        // In progress tickets
        Ticket.countDocuments({ status: 'in-progress' }),
        
        // Pending tickets (open + in-progress)
        Ticket.countDocuments({ status: { $in: ['open', 'in-progress'] } }),
        
        // Resolved tickets
        Ticket.countDocuments({ status: 'resolved' }),
        
        // Closed tickets
        Ticket.countDocuments({ status: 'closed' }),
        
        // Total users (all roles)
        User.countDocuments(),
        
        // Active users
        User.countDocuments({ isActive: true }),
        
        // Urgent tickets (not resolved/closed)
        Ticket.countDocuments({ 
          priority: 'urgent', 
          status: { $nin: ['resolved', 'closed'] } 
        }),
        
        // High priority tickets (not resolved/closed)
        Ticket.countDocuments({ 
          priority: 'high', 
          status: { $nin: ['resolved', 'closed'] } 
        }),
        
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
        
        // Tickets by category
        Ticket.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          },
          {
            $sort: { count: -1 }
          }
        ]),
        
        // Recent tickets (last 10)
        Ticket.find()
          .populate('createdBy', 'name email role department')
          .populate('assignedTo', 'name email role')
          .sort({ createdAt: -1 })
          .limit(10)
          .select('_id ticketId title status priority category createdAt updatedAt')
          .lean(),
        
        // Recent users (last 10 registered)
        User.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .select('_id name email role department isActive createdAt lastLogin')
          .lean(),
        
        // Ticket trends (last 30 days)
        Ticket.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
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
        ]),
        
        // Storage calculation
        calculateStorageUsage()
      ]);

      // Normalize aggregation results with defaults
      const statusDistribution = {
        open: 0,
        'in-progress': 0,
        pending: 0,
        resolved: 0,
        closed: 0
      };
      
      ticketsByStatus.forEach(item => {
        statusDistribution[item._id] = item.count;
      });

      const priorityDistribution = {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      };
      
      ticketsByPriority.forEach(item => {
        priorityDistribution[item._id] = item.count;
      });

      const categoryDistribution = ticketsByCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      stats = {
        overview: {
          totalTickets: totalTickets || 0,
          openTickets: openTickets || 0,
          inProgressTickets: inProgressTickets || 0,
          pendingTickets: pendingTickets || 0,
          resolvedTickets: resolvedTickets || 0,
          closedTickets: closedTickets || 0,
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          urgentTickets: urgentTickets || 0,
          highPriorityTickets: highPriorityTickets || 0,
          storageUsed: storageInfo.totalSize || 0, // in MB
          totalFiles: storageInfo.fileCount || 0
        },
        distribution: {
          byStatus: statusDistribution,
          byPriority: priorityDistribution,
          byCategory: categoryDistribution
        },
        recentActivity: {
          tickets: recentTickets || [],
          users: recentUsers || []
        },
        trends: {
          tickets: ticketTrends || [],
          period: '30 days'
        },
        storage: {
          used: storageInfo.totalSize || 0, // MB
          usedBytes: storageInfo.totalSizeBytes || 0,
          fileCount: storageInfo.fileCount || 0,
          limit: 500, // 500 MB limit (configurable)
          percentage: storageInfo.totalSize ? Math.round((storageInfo.totalSize / 500) * 100) : 0
        }
      };

    } else {
      // User dashboard stats
      const [
        myTickets,
        myOpenTickets,
        myInProgressTickets,
        myPendingTickets,
        myResolvedTickets,
        myClosedTickets,
        myTicketsByStatus,
        myTicketsByPriority,
        myRecentTickets,
        myTicketTrends
      ] = await Promise.all([
        // My total tickets
        Ticket.countDocuments({ createdBy: userId }),
        
        // My open tickets
        Ticket.countDocuments({ createdBy: userId, status: 'open' }),
        
        // My in progress tickets
        Ticket.countDocuments({ createdBy: userId, status: 'in-progress' }),
        
        // My pending tickets
        Ticket.countDocuments({ 
          createdBy: userId, 
          status: { $in: ['open', 'in-progress'] } 
        }),
        
        // My resolved tickets
        Ticket.countDocuments({ createdBy: userId, status: 'resolved' }),
        
        // My closed tickets
        Ticket.countDocuments({ createdBy: userId, status: 'closed' }),
        
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
        
        // My tickets by priority
        Ticket.aggregate([
          { $match: { createdBy: userId } },
          {
            $group: {
              _id: '$priority',
              count: { $sum: 1 }
            }
          }
        ]),
        
        // My recent tickets
        Ticket.find({ createdBy: userId })
          .populate('assignedTo', 'name email role')
          .sort({ createdAt: -1 })
          .limit(10)
          .select('_id ticketId title status priority category createdAt updatedAt')
          .lean(),
        
        // My ticket trends (last 30 days)
        Ticket.aggregate([
          {
            $match: {
              createdBy: userId,
              createdAt: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
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

      // Normalize user stats
      const myStatusDistribution = {
        open: 0,
        'in-progress': 0,
        pending: 0,
        resolved: 0,
        closed: 0
      };
      
      myTicketsByStatus.forEach(item => {
        myStatusDistribution[item._id] = item.count;
      });

      const myPriorityDistribution = {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      };
      
      myTicketsByPriority.forEach(item => {
        myPriorityDistribution[item._id] = item.count;
      });

      stats = {
        overview: {
          myTickets: myTickets || 0,
          myOpenTickets: myOpenTickets || 0,
          myInProgressTickets: myInProgressTickets || 0,
          myPendingTickets: myPendingTickets || 0,
          myResolvedTickets: myResolvedTickets || 0,
          myClosedTickets: myClosedTickets || 0
        },
        distribution: {
          byStatus: myStatusDistribution,
          byPriority: myPriorityDistribution
        },
        recentActivity: {
          tickets: myRecentTickets || []
        },
        trends: {
          tickets: myTicketTrends || [],
          period: '30 days'
        }
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
      message: 'Error fetching dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
          updatedAt: { $gte: startDate },
          resolvedAt: { $exists: true }
        }
      },
      {
        $addFields: {
          resolutionTime: {
            $subtract: ["$resolvedAt", "$createdAt"]
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

    // Tickets by category (using category names directly)
    Ticket.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]),

    // Agent performance (tickets assigned and resolved)
    Ticket.aggregate([
      {
        $match: {
          assignedTo: { $exists: true },
          updatedAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'agent'
        }
      },
      {
        $unwind: '$agent'
      },
      {
        $group: {
          _id: '$assignedTo',
          agentName: { $first: '$agent.name' },
          totalAssigned: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          resolutionRate: {
            $cond: [
              { $eq: ['$totalAssigned', 0] },
              0,
              { $multiply: [{ $divide: ['$resolved', '$totalAssigned'] }, 100] }
            ]
          }
        }
      },
      {
        $sort: { resolutionRate: -1 }
      }
    ])
  ]);

  // Convert resolution time from milliseconds to hours
  const avgResolutionData = analytics[2][0];
  const avgResolutionHours = avgResolutionData ? 
    Math.round((avgResolutionData.avgResolutionTime / (1000 * 60 * 60)) * 100) / 100 : 0;

  res.json({
    success: true,
    data: {
      period: `${days} days`,
      ticketsCreated: analytics[0] || [],
      ticketsResolved: analytics[1] || [],
      avgResolutionTime: {
        hours: avgResolutionHours,
        milliseconds: avgResolutionData?.avgResolutionTime || 0,
        ticketCount: avgResolutionData?.count || 0
      },
      ticketsByCategory: analytics[3] || [],
      agentPerformance: analytics[4] || []
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
