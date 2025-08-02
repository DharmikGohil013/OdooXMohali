import { format, formatDistanceToNow, parseISO } from 'date-fns'

/**
 * Format date for display
 */
export const formatDate = (date, pattern = 'MMM dd, yyyy') => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, pattern)
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy \'at\' h:mm a')
}

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get priority color class
 */
export const getPriorityColor = (priority) => {
  const colors = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
    urgent: 'priority-urgent'
  }
  return colors[priority] || 'badge-gray'
}

/**
 * Get status color class
 */
export const getStatusColor = (status) => {
  const colors = {
    open: 'status-open',
    'in-progress': 'status-in-progress',
    resolved: 'status-resolved',
    closed: 'status-closed'
  }
  return colors[status] || 'badge-gray'
}

/**
 * Get role color class
 */
export const getRoleColor = (role) => {
  const colors = {
    admin: 'badge-danger',
    agent: 'badge-warning',
    user: 'badge-primary'
  }
  return colors[role] || 'badge-gray'
}

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Generate random color for avatar
 */
export const getAvatarColor = (name) => {
  const colors = [
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-gray-500'
  ]
  
  if (!name) return colors[0]
  
  const index = name.length % colors.length
  return colors[index]
}

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate file type
 */
export const isValidFileType = (file, allowedTypes = []) => {
  if (!file || allowedTypes.length === 0) return true
  
  const fileExtension = file.name.split('.').pop().toLowerCase()
  return allowedTypes.includes(fileExtension)
}

/**
 * Validate file size
 */
export const isValidFileSize = (file, maxSize) => {
  if (!file || !maxSize) return true
  return file.size <= maxSize
}

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if user has permission
 */
export const hasPermission = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles) return false
  
  const roleHierarchy = {
    admin: 3,
    agent: 2,
    user: 1
  }
  
  const userLevel = roleHierarchy[userRole] || 0
  const requiredLevel = Math.max(...requiredRoles.map(role => roleHierarchy[role] || 0))
  
  return userLevel >= requiredLevel
}

/**
 * Generate ticket ID display format
 */
export const formatTicketId = (ticketId) => {
  return ticketId ? `#${ticketId}` : ''
}

/**
 * Calculate ticket age in hours
 */
export const getTicketAge = (createdAt) => {
  if (!createdAt) return 0
  const created = typeof createdAt === 'string' ? parseISO(createdAt) : createdAt
  const now = new Date()
  return Math.floor((now - created) / (1000 * 60 * 60))
}

/**
 * Get urgency indicator based on priority and age
 */
export const getUrgencyIndicator = (priority, age) => {
  const urgencyThresholds = {
    urgent: 2, // 2 hours
    high: 8,   // 8 hours
    medium: 24, // 24 hours
    low: 72    // 72 hours
  }
  
  const threshold = urgencyThresholds[priority] || urgencyThresholds.medium
  
  if (age > threshold * 2) return 'critical'
  if (age > threshold) return 'overdue'
  return 'normal'
}

/**
 * Convert query params to object
 */
export const parseQueryParams = (search) => {
  const params = new URLSearchParams(search)
  const result = {}
  
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  
  return result
}

/**
 * Convert object to query string
 */
export const objectToQueryString = (obj) => {
  const params = new URLSearchParams()
  
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      params.append(key, obj[key])
    }
  })
  
  return params.toString()
}
