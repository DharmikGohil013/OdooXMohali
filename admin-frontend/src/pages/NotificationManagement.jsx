import React, { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { adminApi } from '../services/adminApi'
import { formatDate } from '../utils/helpers'

const NotificationManagement = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: notificationsData, loading: notificationsLoading, refetch } = useApi(
    () => adminApi.getNotifications({
      page: currentPage,
      limit: 15,
      type: typeFilter === 'all' ? undefined : typeFilter,
      status: statusFilter === 'all' ? undefined : statusFilter
    }),
    [currentPage, typeFilter, statusFilter]
  )

  const { data: notificationStats } = useApi(
    adminApi.getNotificationStats
  )

  const handleNotificationAction = async (notificationId, action) => {
    setLoading(true)
    try {
      if (action === 'mark-read') {
        await adminApi.markNotificationRead(notificationId)
      } else if (action === 'delete') {
        await adminApi.deleteNotification(notificationId)
      }
      refetch()
    } catch (err) {
      console.error('Action failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAction = async (action) => {
    setLoading(true)
    try {
      if (action === 'mark-all-read') {
        await adminApi.markAllNotificationsRead()
      } else if (action === 'delete-old') {
        await adminApi.deleteOldNotifications()
      }
      refetch()
    } catch (err) {
      console.error('Bulk action failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'system': return 'badge-primary'
      case 'ticket': return 'badge-success'
      case 'user': return 'badge-secondary'
      case 'security': return 'badge-error'
      default: return 'badge-secondary'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'system':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'ticket':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        )
      case 'user':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'security':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
          </svg>
        )
    }
  }

  const tableHeaders = [
    { label: 'Type', field: 'type' },
    { label: 'Message', field: 'message' },
    { label: 'Recipient', field: 'recipient' },
    { label: 'Status', field: 'status' },
    { label: 'Created', field: 'createdAt' },
    { label: 'Actions', field: 'actions' }
  ]

  const tableData = notificationsData?.notifications?.map(notification => ({
    ...notification,
    type: (
      <div className="flex items-center gap-2">
        <div className={`${getTypeColor(notification.type)} flex items-center gap-1`}>
          {getTypeIcon(notification.type)}
          <span>{notification.type}</span>
        </div>
      </div>
    ),
    message: (
      <div className="max-w-md">
        <p className="font-medium text-white">{notification.title}</p>
        <p className="text-sm text-blue-200 truncate">{notification.message}</p>
      </div>
    ),
    recipient: <span className="text-blue-200">{notification.recipient?.name || 'All Users'}</span>,
    status: (
      <div className={`badge ${notification.read ? 'badge-success' : 'badge-warning'}`}>
        {notification.read ? 'Read' : 'Unread'}
      </div>
    ),
    createdAt: <span className="text-blue-200">{formatDate(notification.createdAt)}</span>,
    actions: (
      <div className="flex items-center gap-2">
        {!notification.read && (
          <button
            className="btn-secondary text-sm px-3 py-1.5"
            onClick={() => handleNotificationAction(notification._id, 'mark-read')}
            disabled={loading}
          >
            Mark Read
          </button>
        )}
        <button
          className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
          onClick={() => handleNotificationAction(notification._id, 'delete')}
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
            <h1 className="page-title">Notification Management</h1>
            <p className="page-subtitle">Manage system notifications and announcements</p>
          </div>
          <div className="flex gap-3">
            <button
              className="btn-secondary"
              onClick={() => handleBulkAction('mark-all-read')}
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner w-4 h-4"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark All Read
                </>
              )}
            </button>
            <button
              className="btn-secondary"
              onClick={() => handleBulkAction('delete-old')}
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Old
            </button>
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Notification
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-6">
        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-card-info">
              <div className="stats-label">Total Notifications</div>
              <div className="stats-number">{notificationStats?.total || 0}</div>
            </div>
            <div className="stats-card-icon bg-gradient-to-br from-primary-500 to-primary-600">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-card-info">
              <div className="stats-label">Unread</div>
              <div className="stats-number">{notificationStats?.unread || 0}</div>
            </div>
            <div className="stats-card-icon bg-gradient-to-br from-warning-500 to-warning-600">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-card-info">
              <div className="stats-label">Today</div>
              <div className="stats-number">{notificationStats?.today || 0}</div>
            </div>
            <div className="stats-card-icon bg-gradient-to-br from-success-500 to-success-600">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-card-info">
              <div className="stats-label">System Alerts</div>
              <div className="stats-number">{notificationStats?.systemAlerts || 0}</div>
            </div>
            <div className="stats-card-icon bg-gradient-to-br from-error-500 to-error-600">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            className="form-input"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="all">All Types</option>
            <option value="system">System</option>
            <option value="ticket">Ticket</option>
            <option value="user">User</option>
            <option value="security">Security</option>
          </select>
          
          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="all">All Status</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="glass-card">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white">Notifications</h3>
          <p className="text-blue-200 mt-1">Total: {notificationsData?.pagination?.total || 0} notifications</p>
        </div>
        
        {notificationsLoading ? (
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
                {tableData.map((notification, index) => (
                  <tr key={notification._id || index} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">{notification.type}</td>
                    <td className="px-6 py-4">{notification.message}</td>
                    <td className="px-6 py-4">{notification.recipient}</td>
                    <td className="px-6 py-4">{notification.status}</td>
                    <td className="px-6 py-4">{notification.createdAt}</td>
                    <td className="px-6 py-4">{notification.actions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!tableData || tableData.length === 0) && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-white/60">No notifications found</p>
              </div>
            )}
          </div>
        )}
        
        {notificationsData?.pagination && notificationsData.pagination.pages > 1 && (
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-200">
                Page {currentPage} of {notificationsData.pagination.pages}
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
                  onClick={() => setCurrentPage(prev => Math.min(notificationsData.pagination.pages, prev + 1))}
                  disabled={currentPage === notificationsData.pagination.pages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Create Notification</h2>
              <button
                className="text-white/60 hover:text-white transition-colors"
                onClick={() => setShowCreateModal(false)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <NotificationForm
              onClose={() => setShowCreateModal(false)}
              onSuccess={() => {
                setShowCreateModal(false)
                refetch()
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Notification Form Component
const NotificationForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'system',
    title: '',
    message: '',
    recipient: 'all'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { data: users } = useApi(adminApi.getUsers)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await adminApi.createNotification(formData)
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create notification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Type
        </label>
        <select
          className="form-input"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="system">System</option>
          <option value="ticket">Ticket</option>
          <option value="user">User</option>
          <option value="security">Security</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Title
        </label>
        <input
          className="form-input"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Notification title"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Message
        </label>
        <textarea
          className="form-input"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Notification message"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Recipient
        </label>
        <select
          className="form-input"
          name="recipient"
          value={formData.recipient}
          onChange={handleChange}
          required
        >
          <option value="all">All Users</option>
          {users?.users?.map(user => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="loading-spinner w-4 h-4"></div>
              Creating...
            </div>
          ) : (
            'Create Notification'
          )}
        </button>
      </div>
    </form>
  )
}

export default NotificationManagement
