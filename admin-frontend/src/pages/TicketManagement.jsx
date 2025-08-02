import React, { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { adminApi } from '../services/adminApi'
import { formatDate } from '../utils/helpers'

const TicketManagement = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: ticketsData, loading: ticketsLoading, refetch } = useApi(
    () => adminApi.getTickets({
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: statusFilter === 'all' ? undefined : statusFilter,
      priority: priorityFilter === 'all' ? undefined : priorityFilter
    }),
    [currentPage, searchTerm, statusFilter, priorityFilter]
  )

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleTicketAction = async (ticketId, action, data = {}) => {
    setLoading(true)
    try {
      if (action === 'assign') {
        await adminApi.assignTicket(ticketId, data)
      } else if (action === 'update-status') {
        await adminApi.updateTicketStatus(ticketId, data)
      } else if (action === 'delete') {
        await adminApi.deleteTicket(ticketId)
      }
      refetch()
    } catch (err) {
      console.error('Action failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket)
    setShowTicketModal(true)
  }

  const closeTicketModal = () => {
    setShowTicketModal(false)
    setSelectedTicket(null)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'badge-error'
      case 'medium': return 'badge-warning'
      case 'low': return 'badge-success'
      default: return 'badge-secondary'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'badge-primary'
      case 'in-progress': return 'badge-warning'
      case 'resolved': return 'badge-success'
      case 'closed': return 'badge-secondary'
      default: return 'badge-secondary'
    }
  }

  const tableHeaders = [
    { label: 'ID', field: 'ticketId' },
    { label: 'Title', field: 'title' },
    { label: 'User', field: 'user' },
    { label: 'Status', field: 'status' },
    { label: 'Priority', field: 'priority' },
    { label: 'Created', field: 'createdAt' },
    { label: 'Actions', field: 'actions' }
  ]

  const tableData = ticketsData?.tickets?.map(ticket => ({
    ...ticket,
    ticketId: (
      <span className="font-mono text-primary-400 font-semibold">
        #{ticket._id.slice(-6).toUpperCase()}
      </span>
    ),
    title: (
      <div className="max-w-xs">
        <p className="font-medium text-white truncate">{ticket.title}</p>
        <p className="text-sm text-blue-200">{ticket.category?.name}</p>
      </div>
    ),
    user: <span className="text-blue-200">{ticket.user?.name || 'Unknown'}</span>,
    status: (
      <div className={getStatusColor(ticket.status)}>
        {ticket.status}
      </div>
    ),
    priority: (
      <div className={getPriorityColor(ticket.priority)}>
        {ticket.priority}
      </div>
    ),
    createdAt: <span className="text-blue-200">{formatDate(ticket.createdAt)}</span>,
    actions: (
      <div className="flex items-center gap-2">
        <button
          className="btn-secondary text-sm px-3 py-1.5"
          onClick={() => openTicketModal(ticket)}
        >
          View
        </button>
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleTicketAction(ticket._id, 'update-status', { status: e.target.value })
              e.target.value = ''
            }
          }}
          className="form-input text-xs px-2 py-1 min-w-0"
          disabled={loading}
        >
          <option value="">Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <button
          className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
          onClick={() => handleTicketAction(ticket._id, 'delete')}
          disabled={loading}
        >
          Delete
        </button>
      </div>
    )
  })) || []

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Ticket Management</h1>
            <p className="page-subtitle">Manage and track all support tickets</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Export
            </button>
            <button className="btn-primary">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              className="form-input w-full"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex gap-3">
            <select
              className="form-input min-w-0"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              className="form-input min-w-0"
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="glass-card">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white">Support Tickets</h3>
          <p className="text-blue-200 mt-1">Total: {ticketsData?.pagination?.total || 0} tickets</p>
        </div>
        
        {ticketsLoading ? (
          <div className="flex justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  {tableHeaders.map((header) => (
                    <th key={header.field} className="px-6 py-4 text-left text-sm font-semibold text-white/90 uppercase tracking-wider">
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {tableData.map((ticket, index) => (
                  <tr key={ticket._id || index} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">{ticket.ticketId}</td>
                    <td className="px-6 py-4">{ticket.title}</td>
                    <td className="px-6 py-4">{ticket.user}</td>
                    <td className="px-6 py-4">{ticket.status}</td>
                    <td className="px-6 py-4">{ticket.priority}</td>
                    <td className="px-6 py-4">{ticket.createdAt}</td>
                    <td className="px-6 py-4">{ticket.actions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!tableData || tableData.length === 0) && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-white/60">No tickets found</p>
              </div>
            )}
          </div>
        )}
        
        {ticketsData?.pagination && ticketsData.pagination.pages > 1 && (
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-200">
                Page {currentPage} of {ticketsData.pagination.pages}
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-secondary px-3 py-2 text-sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className="btn-secondary px-3 py-2 text-sm"
                  onClick={() => setCurrentPage(prev => Math.min(ticketsData.pagination.pages, prev + 1))}
                  disabled={currentPage === ticketsData.pagination.pages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {showTicketModal && selectedTicket && (
        <div className="modal-overlay" onClick={closeTicketModal}>
          <div className="modal-content max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Ticket Details - #{selectedTicket._id.slice(-6).toUpperCase()}
              </h2>
              <button
                className="text-white/60 hover:text-white transition-colors"
                onClick={closeTicketModal}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <TicketDetails
              ticket={selectedTicket}
              onClose={closeTicketModal}
              onUpdate={refetch}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Ticket Details Component
const TicketDetails = ({ ticket, onClose, onUpdate }) => {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const addComment = async () => {
    if (!comment.trim()) return
    
    setLoading(true)
    try {
      await adminApi.addTicketComment(ticket._id, { comment })
      setComment('')
      onUpdate()
    } catch (err) {
      console.error('Failed to add comment:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Ticket Info */}
      <div className="grid grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label">Title</label>
          <p className="text-white font-medium">{ticket.title}</p>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <div className={getStatusColor(ticket.status)}>
            {ticket.status}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <div className={getPriorityColor(ticket.priority)}>
            {ticket.priority}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <p className="text-white">{ticket.category?.name || 'Uncategorized'}</p>
        </div>
        <div className="form-group">
          <label className="form-label">Created By</label>
          <p className="text-white">{ticket.user?.name}</p>
        </div>
        <div className="form-group">
          <label className="form-label">Created At</label>
          <p className="text-white">{formatDate(ticket.createdAt)}</p>
        </div>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description</label>
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/90">{ticket.description}</p>
        </div>
      </div>

      {/* Files */}
      {ticket.files && ticket.files.length > 0 && (
        <div className="form-group">
          <label className="form-label">Attachments</label>
          <div className="space-y-2">
            {ticket.files.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className="text-white flex-1">{file.filename}</span>
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-3 py-1">
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Comment */}
      <div className="form-group">
        <label className="form-label">Add Comment</label>
        <div className="flex gap-3">
          <input
            className="form-input flex-1"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button 
            className="btn-primary" 
            onClick={addComment} 
            disabled={loading || !comment.trim()}
          >
            {loading ? (
              <div className="loading-spinner w-4 h-4"></div>
            ) : (
              'Add'
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default TicketManagement
