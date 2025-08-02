import api from './api'

/**
 * Authentication Service
 */
export const authService = {
  // Login admin user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData)
    return response.data
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData)
    return response.data
  }
}

/**
 * Dashboard Service
 */
export const dashboardService = {
  // Get dashboard stats
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },

  // Get analytics data
  getAnalytics: async (params = {}) => {
    const response = await api.get('/dashboard/analytics', { params })
    return response.data
  },

  // Get performance metrics
  getPerformance: async (params = {}) => {
    const response = await api.get('/dashboard/performance', { params })
    return response.data
  }
}

/**
 * Users Service
 */
export const usersService = {
  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params })
    return response.data
  },

  // Get user by ID
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/users', userData)
    return response.data
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  // Update user role
  updateUserRole: async (id, roleData) => {
    const response = await api.put(`/users/${id}/role`, roleData)
    return response.data
  },

  // Toggle user status
  toggleUserStatus: async (id) => {
    const response = await api.put(`/users/${id}/toggle-status`)
    return response.data
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  // Reset user password
  resetPassword: async (id, passwordData) => {
    const response = await api.put(`/users/${id}/reset-password`, passwordData)
    return response.data
  },

  // Get user stats
  getUserStats: async () => {
    const response = await api.get('/users/stats')
    return response.data
  },

  // Get agents list
  getAgents: async () => {
    const response = await api.get('/users/agents')
    return response.data
  }
}

/**
 * Tickets Service
 */
export const ticketsService = {
  // Get all tickets
  getTickets: async (params = {}) => {
    const response = await api.get('/tickets', { params })
    return response.data
  },

  // Get ticket by ID
  getTicket: async (id) => {
    const response = await api.get(`/tickets/${id}`)
    return response.data
  },

  // Assign ticket
  assignTicket: async (id, assignData) => {
    const response = await api.put(`/tickets/${id}/assign`, assignData)
    return response.data
  },

  // Delete ticket
  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`)
    return response.data
  },

  // Get ticket stats
  getTicketStats: async () => {
    const response = await api.get('/tickets/stats')
    return response.data
  }
}

/**
 * Files Service
 */
export const filesService = {
  // Get file stats
  getFileStats: async () => {
    const response = await api.get('/upload/stats')
    return response.data
  },

  // Delete file
  deleteFile: async (filename) => {
    const response = await api.delete(`/upload/file/${filename}`)
    return response.data
  },

  // Cleanup old files
  cleanupFiles: async () => {
    const response = await api.delete('/upload/cleanup')
    return response.data
  }
}

/**
 * Notifications Service
 */
export const notificationsService = {
  // Get notification stats
  getNotificationStats: async () => {
    const response = await api.get('/notifications/stats')
    return response.data
  },

  // Create notification
  createNotification: async (notificationData) => {
    const response = await api.post('/notifications', notificationData)
    return response.data
  },

  // Get notifications history
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params })
    return response.data
  }
}

/**
 * Categories Service
 */
export const categoriesService = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/categories')
    return response.data
  },

  // Create category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData)
    return response.data
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData)
    return response.data
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  }
}

// Consolidated API exports for easier importing
export const adminApi = {
  auth: authService,
  dashboard: dashboardService,
  users: usersService,
  tickets: ticketsService,
  files: filesService,
  notifications: notificationsService,
  categories: categoriesService
}

// Auth API alias for components that import authApi specifically
export const authApi = authService
