import Notification from '../models/Notification.js';

/**
 * Notification Service - Helper functions to create notifications
 */

/**
 * Create a notification
 */
export const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Create ticket-related notification
 */
export const createTicketNotification = async (ticket, type, recipient) => {
  try {
    let title, message, actionUrl;

    switch (type) {
      case 'ticket_created':
        title = `New Ticket Created - ${ticket.ticketId}`;
        message = `A new ticket "${ticket.title}" has been created with ${ticket.priority} priority.`;
        actionUrl = `/tickets/${ticket._id}`;
        break;

      case 'ticket_assigned':
        title = `Ticket Assigned - ${ticket.ticketId}`;
        message = `You have been assigned to ticket "${ticket.title}".`;
        actionUrl = `/tickets/${ticket._id}`;
        break;

      case 'ticket_updated':
        title = `Ticket Updated - ${ticket.ticketId}`;
        message = `Ticket "${ticket.title}" has been updated. Status: ${ticket.status}`;
        actionUrl = `/tickets/${ticket._id}`;
        break;

      case 'ticket_resolved':
        title = `Ticket Resolved - ${ticket.ticketId}`;
        message = `Great news! Your ticket "${ticket.title}" has been resolved.`;
        actionUrl = `/tickets/${ticket._id}`;
        break;

      default:
        title = `Ticket Notification - ${ticket.ticketId}`;
        message = `There's an update on your ticket "${ticket.title}".`;
        actionUrl = `/tickets/${ticket._id}`;
    }

    const notification = await createNotification({
      recipient,
      title,
      message,
      type,
      priority: ticket.priority === 'urgent' ? 'urgent' : 'medium',
      relatedTicket: ticket._id,
      actionUrl,
      metadata: {
        ticketId: ticket.ticketId,
        ticketTitle: ticket.title,
        ticketStatus: ticket.status,
        ticketPriority: ticket.priority
      }
    });

    return notification;
  } catch (error) {
    console.error('Error creating ticket notification:', error);
    throw error;
  }
};

/**
 * Notify ticket participants (creator and assigned agent)
 */
export const notifyTicketParticipants = async (ticket, type, excludeUser = null) => {
  const notifications = [];

  try {
    // Notify ticket creator
    if (ticket.createdBy && ticket.createdBy._id.toString() !== excludeUser?.toString()) {
      const notification = await createTicketNotification(ticket, type, ticket.createdBy._id);
      notifications.push(notification);
    }

    // Notify assigned agent (if different from creator)
    if (ticket.assignedTo && 
        ticket.assignedTo._id.toString() !== ticket.createdBy._id.toString() &&
        ticket.assignedTo._id.toString() !== excludeUser?.toString()) {
      const notification = await createTicketNotification(ticket, type, ticket.assignedTo._id);
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('Error notifying ticket participants:', error);
    return [];
  }
};

/**
 * Create system notification
 */
export const createSystemNotification = async (recipient, title, message, priority = 'medium') => {
  try {
    const notification = await createNotification({
      recipient,
      title,
      message,
      type: 'system',
      priority,
      metadata: {
        source: 'system',
        timestamp: new Date()
      }
    });

    return notification;
  } catch (error) {
    console.error('Error creating system notification:', error);
    throw error;
  }
};

/**
 * Create announcement notification for all users
 */
export const createAnnouncementNotification = async (title, message, priority = 'medium', userIds = []) => {
  try {
    const notifications = [];

    for (const userId of userIds) {
      const notification = await createNotification({
        recipient: userId,
        title,
        message,
        type: 'announcement',
        priority,
        metadata: {
          source: 'announcement',
          timestamp: new Date()
        }
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('Error creating announcement notifications:', error);
    throw error;
  }
};

/**
 * Mark notifications as read
 */
export const markNotificationsAsRead = async (userId, notificationIds = []) => {
  try {
    const filter = { recipient: userId, isRead: false };
    
    if (notificationIds.length > 0) {
      filter._id = { $in: notificationIds };
    }

    const result = await Notification.updateMany(filter, { isRead: true });
    return result;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

/**
 * Get unread notification count for user
 */
export const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });
    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

/**
 * Clean old notifications (older than 30 days)
 */
export const cleanOldNotifications = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Notification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      isRead: true
    });

    console.log(`Cleaned ${result.deletedCount} old notifications`);
    return result;
  } catch (error) {
    console.error('Error cleaning old notifications:', error);
    throw error;
  }
};
