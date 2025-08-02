import api from './api'

// Get all categories
const getCategories = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const response = await api.get(`/categories?${queryString}`)
  return response.data
}

// Get category by ID
const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

// Create new category
const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData)
  return response.data
}

// Update category
const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData)
  return response.data
}

// Delete category
const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`)
  return response.data
}

// Get category statistics
const getCategoryStats = async () => {
  const response = await api.get('/categories/stats')
  return response.data
}

// Bulk update categories
const bulkUpdateCategories = async (categoryIds, action, data = {}) => {
  const response = await api.put('/categories/bulk', {
    categoryIds,
    action,
    data
  })
  return response.data
}

const categoryService = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  bulkUpdateCategories,
}

export default categoryService
