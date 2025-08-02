import api from './api'

// Get all users (Admin only)
const getUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const response = await api.get(`/users?${queryString}`)
  return response.data
}

// Get user by ID
const getUser = async (id) => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

// Create new user (Admin only)
const createUser = async (userData) => {
  const response = await api.post('/users', userData)
  return response.data
}

// Update user (Admin only)
const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData)
  return response.data
}

// Delete user (Admin only)
const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`)
  return response.data
}

// Get agents for ticket assignment
const getAgents = async () => {
  const response = await api.get('/users/agents')
  return response.data
}

// Get user statistics (Admin only)
const getUserStats = async () => {
  const response = await api.get('/users/stats')
  return response.data
}

const userService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAgents,
  getUserStats,
}

export default userService
