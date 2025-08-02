import api from './api'

// Register user
const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  
  if (response.data.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
    localStorage.setItem('token', response.data.data.token)
  }
  
  return response.data
}

// Login user
const login = async (userData) => {
  const response = await api.post('/auth/login', userData)
  
  if (response.data.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
    localStorage.setItem('token', response.data.data.token)
  }
  
  return response.data
}

// Get current user
const getMe = async () => {
  const response = await api.get('/auth/me')
  
  if (response.data.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
  }
  
  return response.data
}

// Update profile
const updateProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData)
  
  if (response.data.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
  }
  
  return response.data
}

// Change password
const changePassword = async (passwordData) => {
  const response = await api.put('/auth/change-password', passwordData)
  return response.data
}

// Forgot password
const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email })
  return response.data
}

// Reset password
const resetPassword = async (token, password) => {
  const response = await api.put(`/auth/reset-password/${token}`, {
    newPassword: password
  })
  
  if (response.data.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
    localStorage.setItem('token', response.data.data.token)
  }
  
  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

const authService = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
}

export default authService
