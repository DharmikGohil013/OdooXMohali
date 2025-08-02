import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { adminApi } from '../services/adminApi'
import { formatDate } from '../utils/helpers'

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Use real data from your backend
  const mockUsersData = {
    data: [
      {
        _id: "688d93d7f34aee1b7f2ddcda",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "user",
        department: "IT",
        phone: "+1234567890",
        isActive: true,
        createdAt: "2025-08-02T04:28:07.802Z"
      },
      {
        _id: "688d975b67e641ec57be6449",
        name: "John Doe",
        email: "john.dose@example.com",
        role: "user",
        department: "IT",
        phone: "+1234567890",
        isActive: true,
        createdAt: "2025-08-02T04:43:07.176Z"
      },
      {
        _id: "688d97de67e641ec57be644c",
        name: "GOHIL DHARMIKBHAI GHANSHYAMBHAI",
        email: "23dit013@charusat.edu.in",
        role: "user",
        department: "",
        phone: "9624105887",
        isActive: true,
        lastLogin: "2025-08-02T08:26:55.696Z",
        createdAt: "2025-08-02T04:45:18.812Z"
      },
      {
        _id: "688dbc928d8dc441c318c7c7",
        name: "System Admin",
        email: "admin@quickdesk.com",
        role: "admin",
        isActive: true,
        lastLogin: "2025-08-02T09:53:29.813Z",
        createdAt: "2025-08-02T07:21:54.628Z"
      },
      {
        _id: "688dbd4842de2a48145ad677",
        name: "John Doe",
        email: "john.doess@example.com",
        role: "user",
        department: "IT",
        phone: "+1234567890",
        isActive: true,
        createdAt: "2025-08-02T07:24:56.487Z"
      },
      {
        _id: "688dd31bf95d04717670fbc4",
        name: "Admin User",
        email: "adminss@quickdesk.com",
        role: "user",
        department: "Administration",
        phone: "+1234567890",
        isActive: true,
        lastLogin: "2025-08-02T09:50:57.927Z",
        createdAt: "2025-08-02T08:58:03.475Z"
      },
      {
        _id: "688dd44c2490d825398af0a7",
        name: "user",
        email: "usergottalent1156@gmail.com",
        role: "user",
        department: "",
        phone: "9313929324",
        isActive: true,
        createdAt: "2025-08-02T09:03:08.633Z"
      },
      {
        _id: "688dd5cd2490d825398af138",
        name: "Kris gadara",
        email: "krishgadara0701@gmail.com",
        role: "user",
        department: "IT",
        phone: "9313929324",
        isActive: true,
        createdAt: "2025-08-02T09:09:33.336Z"
      },
      {
        _id: "688ddd63c6e9c8e5d7487cfb",
        name: "Admin User",
        email: "admaainss@quickdesk.com",
        role: "user",
        department: "Administration",
        phone: "+1234567890",
        isActive: true,
        createdAt: "2025-08-02T09:41:55.335Z"
      }
    ],
    total: 9,
    totalPages: 1,
    currentPage: 1
  }

  const usersData = mockUsersData
  const usersLoading = false
  const error = null

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleUserAction = async (userId, action) => {
    setLoading(true)
    try {
      if (action === 'toggle-status') {
        await adminApi.toggleUserStatus(userId)
      } else if (action === 'delete') {
        await adminApi.deleteUser(userId)
      }
      refetch()
    } catch (err) {
      console.error('Action failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const openUserModal = (user = null) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const closeUserModal = () => {
    setShowUserModal(false)
    setSelectedUser(null)
  }

  const tableHeaders = [
    { label: 'User', field: 'name' },
    { label: 'Email', field: 'email' },
    { label: 'Role', field: 'role' },
    { label: 'Status', field: 'isActive' },
    { label: 'Joined', field: 'createdAt' },
    { label: 'Actions', field: 'actions' }
  ]

  const tableData = usersData?.users?.map(user => ({
    ...user,
    name: (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-white">
            {(user.name?.charAt(0) || 'U').toUpperCase()}
          </span>
        </div>
        <span className="font-medium text-white">{user.name}</span>
      </div>
    ),
    role: (
      <div className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
        {user.role}
      </div>
    ),
    isActive: (
      <div className={`badge ${user.isActive ? 'badge-success' : 'badge-error'}`}>
        {user.isActive ? 'Active' : 'Inactive'}
      </div>
    ),
    createdAt: <span className="text-blue-200">{formatDate(user.createdAt)}</span>,
    actions: (
      <div className="flex items-center gap-2">
        <button
          className="btn-secondary text-sm px-3 py-1.5"
          onClick={() => openUserModal(user)}
        >
          View
        </button>
        <button
          className={`btn-${user.isActive ? 'secondary' : 'primary'} text-sm px-3 py-1.5`}
          onClick={() => handleUserAction(user._id, 'toggle-status')}
          disabled={loading}
        >
          {user.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button
          className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
          onClick={() => handleUserAction(user._id, 'delete')}
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
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">Manage system users and their permissions</p>
          </div>
          <button className="btn-primary" onClick={() => openUserModal()}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              className="form-input w-full"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map((status) => (
              <button
                key={status}
                className={`${statusFilter === status ? 'btn-primary' : 'btn-secondary'} px-4 py-2 text-sm`}
                onClick={() => handleStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white">Users</h3>
          <p className="text-blue-200 mt-1">Total: {usersData?.pagination?.total || 0} users</p>
        </div>
        
        {usersLoading ? (
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
                {tableData.map((user, index) => (
                  <tr key={user._id || index} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4 text-blue-200">{user.email}</td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">{user.isActive}</td>
                    <td className="px-6 py-4">{user.createdAt}</td>
                    <td className="px-6 py-4">{user.actions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!tableData || tableData.length === 0) && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-white/60">No users found</p>
              </div>
            )}
          </div>
        )}
        
        {usersData?.pagination && usersData.pagination.pages > 1 && (
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-200">
                Page {currentPage} of {usersData.pagination.pages}
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
                  onClick={() => setCurrentPage(prev => Math.min(usersData.pagination.pages, prev + 1))}
                  disabled={currentPage === usersData.pagination.pages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-overlay" onClick={closeUserModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {selectedUser ? 'User Details' : 'Add New User'}
              </h2>
              <button
                className="text-white/60 hover:text-white transition-colors"
                onClick={closeUserModal}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <UserForm
              user={selectedUser}
              onClose={closeUserModal}
              onSuccess={() => {
                closeUserModal()
                refetch()
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// User Form Component
const UserForm = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    isActive: user?.isActive ?? true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (user) {
        await adminApi.updateUser(user._id, formData)
      } else {
        await adminApi.createUser(formData)
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Name
        </label>
        <input
          className="form-input"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
          Email
        </label>
        <input
          className="form-input"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Role
        </label>
        <select
          className="form-input"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
        />
        <label className="text-white/90 font-medium">
          Active User
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="loading-spinner w-4 h-4"></div>
              Processing...
            </div>
          ) : (
            `${user ? 'Update' : 'Create'} User`
          )}
        </button>
      </div>
    </form>
  )
}

export default UserManagement
