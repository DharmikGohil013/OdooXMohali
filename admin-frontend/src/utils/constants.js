/**
 * Application constants for Admin Panel
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
}

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  USER: 'user'
}

// Ticket Statuses
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
}

// Ticket Priorities
export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
}

// Priority Options for Forms
export const PRIORITY_OPTIONS = [
  { value: TICKET_PRIORITY.LOW, label: 'Low', color: 'blue' },
  { value: TICKET_PRIORITY.MEDIUM, label: 'Medium', color: 'yellow' },
  { value: TICKET_PRIORITY.HIGH, label: 'High', color: 'orange' },
  { value: TICKET_PRIORITY.URGENT, label: 'Urgent', color: 'red' }
]

// Status Options for Forms
export const STATUS_OPTIONS = [
  { value: TICKET_STATUS.OPEN, label: 'Open', color: 'blue' },
  { value: TICKET_STATUS.IN_PROGRESS, label: 'In Progress', color: 'yellow' },
  { value: TICKET_STATUS.RESOLVED, label: 'Resolved', color: 'green' },
  { value: TICKET_STATUS.CLOSED, label: 'Closed', color: 'gray' }
]

// Role Options for Forms
export const ROLE_OPTIONS = [
  { value: USER_ROLES.USER, label: 'User' },
  { value: USER_ROLES.AGENT, label: 'Agent' },
  { value: USER_ROLES.ADMIN, label: 'Admin' }
]

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100
}

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  WITH_TIME: 'MMM dd, yyyy \'at\' h:mm a',
  TIME_ONLY: 'h:mm a'
}

// Toast Notification Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'admin_token',
  USER: 'admin_user',
  THEME: 'admin_theme',
  SIDEBAR_COLLAPSED: 'admin_sidebar_collapsed'
}

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  TICKETS: '/tickets',
  FILES: '/files',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile'
}

// Navigation Menu Items
export const NAVIGATION = [
  {
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
    description: 'Overview and analytics'
  },
  {
    name: 'Users',
    path: ROUTES.USERS,
    icon: 'users',
    description: 'User management'
  },
  {
    name: 'Tickets',
    path: ROUTES.TICKETS,
    icon: 'tickets',
    description: 'Ticket management'
  },
  {
    name: 'Files',
    path: ROUTES.FILES,
    icon: 'files',
    description: 'File management'
  },
  {
    name: 'Notifications',
    path: ROUTES.NOTIFICATIONS,
    icon: 'notifications',
    description: 'Notification management'
  }
]

// Chart Colors
export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  gray: '#6b7280'
}

// Dashboard Refresh Intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  DASHBOARD: 30000, // 30 seconds
  REAL_TIME: 5000,  // 5 seconds
  SLOW: 60000       // 1 minute
}
