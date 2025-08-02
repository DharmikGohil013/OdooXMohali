// Mock categories data for development and testing
export const mockCategories = [
  {
    _id: '1',
    name: 'Technical Support',
    description: 'Hardware, software, and system-related issues',
    color: '#3b82f6', // Blue
    icon: 'desktop',
    slug: 'technical-support',
    isActive: true,
    priority: 1,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    _id: '2',
    name: 'Account & Billing',
    description: 'Account access, billing questions, and payment issues',
    color: '#10b981', // Green
    icon: 'credit-card',
    slug: 'account-billing',
    isActive: true,
    priority: 2,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    _id: '3',
    name: 'Bug Report',
    description: 'Report software bugs and unexpected behavior',
    color: '#ef4444', // Red
    icon: 'bug',
    slug: 'bug-report',
    isActive: true,
    priority: 3,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    _id: '4',
    name: 'Feature Request',
    description: 'Suggest new features and improvements',
    color: '#8b5cf6', // Purple
    icon: 'lightbulb',
    slug: 'feature-request',
    isActive: true,
    priority: 4,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    _id: '5',
    name: 'General Inquiry',
    description: 'General questions and information requests',
    color: '#6b7280', // Gray
    icon: 'help-circle',
    slug: 'general-inquiry',
    isActive: true,
    priority: 5,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    _id: '6',
    name: 'Security',
    description: 'Security concerns, access issues, and privacy questions',
    color: '#f59e0b', // Amber
    icon: 'shield',
    slug: 'security',
    isActive: true,
    priority: 6,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    _id: '7',
    name: 'Training & Documentation',
    description: 'Help with using features and finding documentation',
    color: '#06b6d4', // Cyan
    icon: 'book',
    slug: 'training-documentation',
    isActive: true,
    priority: 7,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    _id: '8',
    name: 'Integration Support',
    description: 'API integration, third-party connections, and webhooks',
    color: '#84cc16', // Lime
    icon: 'link',
    slug: 'integration-support',
    isActive: true,
    priority: 8,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  }
]

// Category statistics for admin dashboard
export const mockCategoryStats = {
  totalCategories: mockCategories.length,
  activeCategories: mockCategories.filter(cat => cat.isActive).length,
  ticketsByCategory: {
    'technical-support': 45,
    'account-billing': 23,
    'bug-report': 12,
    'feature-request': 8,
    'general-inquiry': 34,
    'security': 6,
    'training-documentation': 15,
    'integration-support': 7
  },
  avgResolutionTime: {
    'technical-support': '2.5 hours',
    'account-billing': '1.2 hours',
    'bug-report': '4.8 hours',
    'feature-request': '72 hours',
    'general-inquiry': '30 minutes',
    'security': '1 hour',
    'training-documentation': '45 minutes',
    'integration-support': '3.2 hours'
  }
}

// Helper function to get category by ID
export const getCategoryById = (id) => {
  return mockCategories.find(category => category._id === id)
}

// Helper function to get category by slug
export const getCategoryBySlug = (slug) => {
  return mockCategories.find(category => category.slug === slug)
}

// Helper function to get active categories
export const getActiveCategories = () => {
  return mockCategories.filter(category => category.isActive)
}

// Helper function to get categories sorted by priority
export const getCategoriesByPriority = () => {
  return [...mockCategories].sort((a, b) => a.priority - b.priority)
}

export default mockCategories
