/**
 * Application constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf,doc,docx').split(',')
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
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
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
  USER: 'user',
  TOKEN: 'token',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed'
}

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  TICKETS: '/tickets',
  TICKET_DETAIL: '/tickets/:id',
  CREATE_TICKET: '/tickets/new',
  PROFILE: '/profile',
  USERS: '/users',
  CATEGORIES: '/categories',
  SETTINGS: '/settings'
}

// Navigation Menu Items
export const NAVIGATION = {
  USER: [
    { 
      name: 'Dashboard', 
      path: ROUTES.DASHBOARD, 
      icon: 'dashboard',
      description: 'Overview and statistics' 
    },
    { 
      name: 'My Tickets', 
      path: ROUTES.TICKETS, 
      icon: 'tickets',
      description: 'View and manage your tickets'
    },
    { 
      name: 'Create Ticket', 
      path: ROUTES.CREATE_TICKET, 
      icon: 'plus',
      description: 'Submit a new support request'
    },
    { 
      name: 'Profile', 
      path: ROUTES.PROFILE, 
      icon: 'user',
      description: 'Manage your account settings'
    }
  ],
  AGENT: [
    { 
      name: 'Dashboard', 
      path: ROUTES.DASHBOARD, 
      icon: 'dashboard',
      description: 'Overview and statistics' 
    },
    { 
      name: 'All Tickets', 
      path: ROUTES.TICKETS, 
      icon: 'tickets',
      description: 'View and manage all tickets'
    },
    { 
      name: 'Categories', 
      path: ROUTES.CATEGORIES, 
      icon: 'category',
      description: 'Manage ticket categories'
    },
    { 
      name: 'Profile', 
      path: ROUTES.PROFILE, 
      icon: 'user',
      description: 'Manage your account settings'
    }
  ],
  ADMIN: [
    { 
      name: 'Dashboard', 
      path: ROUTES.DASHBOARD, 
      icon: 'dashboard',
      description: 'Overview and statistics' 
    },
    { 
      name: 'All Tickets', 
      path: ROUTES.TICKETS, 
      icon: 'tickets',
      description: 'View and manage all tickets'
    },
    { 
      name: 'Users', 
      path: ROUTES.USERS, 
      icon: 'users',
      description: 'Manage system users'
    },
    { 
      name: 'Categories', 
      path: ROUTES.CATEGORIES, 
      icon: 'category',
      description: 'Manage ticket categories'
    },
    { 
      name: 'Profile', 
      path: ROUTES.PROFILE, 
      icon: 'user',
      description: 'Manage your account settings'
    }
  ]
}

// Error Messages
export const ERROR_MESSAGES = {
  GENERAL: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION: 'Please check your input and try again.',
  FILE_SIZE: 'File size exceeds the maximum allowed size.',
  FILE_TYPE: 'File type is not allowed.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  WEAK_PASSWORD: 'Password must be at least 6 characters long.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  LOGOUT: 'You have been logged out successfully.',
  REGISTRATION: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  TICKET_CREATED: 'Ticket created successfully!',
  TICKET_UPDATED: 'Ticket updated successfully!',
  TICKET_DELETED: 'Ticket deleted successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
  CATEGORY_CREATED: 'Category created successfully!',
  CATEGORY_UPDATED: 'Category updated successfully!',
  CATEGORY_DELETED: 'Category deleted successfully!',
  USER_CREATED: 'User created successfully!',
  USER_UPDATED: 'User updated successfully!',
  USER_DELETED: 'User deleted successfully!'
}

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#22C55E',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#06B6D4',
  SECONDARY: '#6B7280',
  LIGHT: '#F3F4F6',
  DARK: '#1F2937'
}

// Responsive Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

// Default Avatar Colors
export const AVATAR_COLORS = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#22C55E', // green
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16'  // lime
]
