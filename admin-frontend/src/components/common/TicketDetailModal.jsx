import React, { useState } from 'react'
import Modal from './Modal'
import { formatDate } from '../../utils/helpers'

const TicketDetailModal = ({ ticket, isOpen, onClose, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(ticket?.status || 'pending')
  const [selectedPriority, setSelectedPriority] = useState(ticket?.priority || 'medium')
  const [isUpdating, setIsUpdating] = useState(false)

  if (!ticket) return null

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ]

  const handleUpdateTicket = async () => {
    setIsUpdating(true)
    
    // Simulate API call
    setTimeout(() => {
      onUpdateStatus && onUpdateStatus(ticket._id, {
        status: selectedStatus,
        priority: selectedPriority
      })
      setIsUpdating(false)
      onClose()
    }, 800)
  }

  const getStatusColor = (status) => {
    const statusMap = {
      'pending': 'bg-yellow-500',
      'in-progress': 'bg-blue-500',
      'resolved': 'bg-green-500',
      'closed': 'bg-gray-500'
    }
    return statusMap[status] || 'bg-gray-500'
  }

  const getPriorityColor = (priority) => {
    const priorityMap = {
      'low': 'bg-green-500',
      'medium': 'bg-yellow-500',
      'high': 'bg-orange-500',
      'urgent': 'bg-red-500'
    }
    return priorityMap[priority] || 'bg-gray-500'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ticket Details" size="medium">
      <div className="space-y-6">
        {/* Main Ticket Info */}
        <div className="glass-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">{ticket.title}</h2>
              <p className="text-sm text-blue-200 mb-3">ID: {ticket.ticketId || ticket._id.slice(-8)}</p>
              <p className="text-white/80 leading-relaxed">{ticket.description}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {ticket.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{ticket.user?.name || 'Unknown User'}</p>
                  <p className="text-blue-200 text-xs">{formatDate(ticket.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-white text-sm ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Update Status</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Status</label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field w-full"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Priority</label>
              <select 
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="input-field w-full"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button 
              onClick={handleUpdateTicket}
              disabled={isUpdating}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              {isUpdating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Ticket'
              )}
            </button>
            <button 
              onClick={onClose}
              className="btn-secondary px-6"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TicketDetailModal
