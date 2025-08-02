import api from './api'

// Get all tickets
const getTickets = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const response = await api.get(`/tickets?${queryString}`)
  return response.data
}

// Get ticket by ID
const getTicket = async (id) => {
  const response = await api.get(`/tickets/${id}`)
  return response.data
}

// Create new ticket
const createTicket = async (ticketData) => {
  // Handle file uploads
  const formData = new FormData()
  
  // Append text fields
  Object.keys(ticketData).forEach(key => {
    if (key !== 'attachments') {
      formData.append(key, ticketData[key])
    }
  })
  
  // Append files
  if (ticketData.attachments && ticketData.attachments.length > 0) {
    ticketData.attachments.forEach(file => {
      formData.append('attachments', file)
    })
  }
  
  const response = await api.post('/tickets', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Update ticket
const updateTicket = async (id, ticketData) => {
  const response = await api.put(`/tickets/${id}`, ticketData)
  return response.data
}

// Delete ticket
const deleteTicket = async (id) => {
  const response = await api.delete(`/tickets/${id}`)
  return response.data
}

// Add comment to ticket
const addComment = async (id, commentData) => {
  const response = await api.post(`/tickets/${id}/comments`, commentData)
  return response.data
}

// Rate ticket
const rateTicket = async (id, ratingData) => {
  const response = await api.post(`/tickets/${id}/rate`, ratingData)
  return response.data
}

// Get ticket statistics
const getTicketStats = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const response = await api.get(`/tickets/stats?${queryString}`)
  return response.data
}

const ticketService = {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  rateTicket,
  getTicketStats,
}

export default ticketService
