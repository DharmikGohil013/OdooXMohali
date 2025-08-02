import React, { useState, useEffect } from 'react'
import { dashboardService } from '../services/adminApi'
import { formatDate } from '../utils/helpers'
import TicketDetailModal from '../components/common/TicketDetailModal'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showTicketModal, setShowTicketModal] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardService.getStats()
      setDashboardData(data)
    } catch (err) {
      console.error('Dashboard API Error:', err)
      setError(err.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Handle ticket click to open modal
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket)
    setShowTicketModal(true)
  }

  // Handle ticket status update
  const handleUpdateTicketStatus = (ticketId, updates) => {
    console.log('Updating ticket:', ticketId, updates)
    // In real app, this would call API to update ticket
    // For now, just close modal
    setShowTicketModal(false)
    setSelectedTicket(null)
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-white/60">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="glass-card p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-error-500 to-error-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-error-400 font-semibold">Error loading dashboard data</p>
          <p className="text-white/60 text-sm mt-2">{error}</p>
          <button 
            className="btn-primary mt-4"
            onClick={fetchDashboardData}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const { overview, recentActivity } = dashboardData || {}

  // Use real data or fallback to mock data for demo
  const dashboardStats = {
    totalUsers: 10,
    totalTickets: 24,
    pendingTickets: 20
  }

  const recentTickets = [
    {
      _id: "688dbf7fecad964305892c4e",
      title: "Cannot login to my account",
      description: "I'm having trouble logging into my account. When I enter my credential...",
      ticketId: "TKT-000001",
      priority: "high",
      status: "open",
      category: "Account & Billing",
      createdBy: "688dbd4842de2a48145ad677",
      createdAt: "2025-08-02T07:34:23.891Z",
      user: { name: "John Doe" }
    },
    {
      _id: "688dc054ecad964305892c59",
      title: "Cannot login to my account",
      description: "I'm having trouble logging into my account. When I enter my credentia...",
      ticketId: "TKT-000002",
      priority: "low",
      status: "open",
      category: "Account & Billing",
      createdBy: "688dbd4842de2a48145ad677",
      createdAt: "2025-08-02T07:37:56.150Z",
      user: { name: "John Doe" }
    },
    {
      _id: "688dc18afb3c7e0592e0f6a0",
      title: "wertyuiop[poiuytrew",
      description: "sdfghjkl;';lkjhgfd",
      ticketId: "TKT-000003",
      priority: "low",
      status: "open",
      category: "Technical Support",
      createdBy: "688d97de67e641ec57be644c",
      createdAt: "2025-08-02T07:43:06.100Z",
      user: { name: "GOHIL DHARMIKBHAI" }
    },
    {
      _id: "688dc3e7bd9a2e182b21b37e",
      title: "asdas",
      description: "asdfbn nbfdsdfgnm",
      ticketId: "TKT-000006",
      priority: "urgent",
      status: "open",
      category: "General Inquiry",
      createdBy: "688d97de67e641ec57be644c",
      createdAt: "2025-08-02T07:53:11.640Z",
      user: { name: "GOHIL DHARMIKBHAI" }
    },
    {
      _id: "688dd5fa2490d825398af16b",
      title: "Alert",
      description: "alert is there",
      ticketId: "TKT-000007",
      priority: "medium",
      status: "open",
      category: "Technical Support",
      createdBy: "688dd5cd2490d825398af138",
      createdAt: "2025-08-02T09:10:18.076Z",
      user: { name: "Kris gadara" }
    }
  ]

  const recentUsers = [
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
      _id: "688dd5cd2490d825398af138",
      name: "Kris gadara",
      email: "krishgadara0701@gmail.com",
      role: "user",
      department: "IT",
      phone: "9313929324",
      isActive: true,
      createdAt: "2025-08-02T09:09:33.336Z"
    }
  ]

  // StatCard Component for Overview Cards
  const StatCard = ({ icon, label, value, change, changeType, gradient }) => (
    <div className="stats-card">
      <div className="stats-card-content">
        <div className="stats-card-info">
          <div className="stats-label">{label}</div>
          <div className="stats-number">{value}</div>
          {change && (
            <div className={`stats-change ${changeType}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {changeType === 'positive' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                )}
              </svg>
              {change}
            </div>
          )}
        </div>
        <div className={`stats-card-icon ${gradient}`}>
          {icon}
        </div>
      </div>
    </div>
  )

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back! Here's what's happening with your support system.</p>
          </div>
          <button 
            className="btn-primary"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="stats-grid">
        <StatCard
          icon={
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          label="Total Users"
          value={dashboardStats.totalUsers.toLocaleString()}
          gradient="bg-gradient-to-br from-primary-500 to-primary-600"
        />

        <StatCard
          icon={
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          }
          label="Total Tickets"
          value={dashboardStats.totalTickets.toLocaleString()}
          gradient="bg-gradient-to-br from-success-500 to-success-600"
        />

        <StatCard
          icon={
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Pending Tickets"
          value={dashboardStats.pendingTickets.toLocaleString()}
          gradient="bg-gradient-to-br from-warning-500 to-warning-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="content-grid">
        {/* Recent Tickets */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Tickets</h3>
            <a href="/tickets" className="btn-primary text-sm px-4 py-2">
              View all
            </a>
          </div>
          
          <div className="space-y-4">
            {recentTickets && recentTickets.length > 0 ? (
              recentTickets.map((ticket) => (
                <div 
                  key={ticket._id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => handleTicketClick(ticket)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      ticket.priority === 'urgent' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                      ticket.priority === 'high' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                      ticket.priority === 'medium' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">{ticket.title}</p>
                      <p className="text-sm text-blue-200">
                        {ticket.user?.name || 'Unknown User'} • {ticket.ticketId} • {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`badge ${
                      ticket.priority === 'urgent' ? 'badge-error' :
                      ticket.priority === 'high' ? 'badge-warning' :
                      ticket.priority === 'medium' ? 'badge-info' :
                      'badge-secondary'
                    }`}>
                      {ticket.priority}
                    </div>
                    <div className="badge badge-primary">
                      {ticket.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-white/60">No recent tickets</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Users</h3>
            <a href="/users" className="btn-primary text-sm px-4 py-2">
              View all
            </a>
          </div>
          
          <div className="space-y-4">
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                      'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                      <span className="text-sm font-semibold text-white">
                        {(user.name?.charAt(0) || 'U').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name || 'Unknown User'}</p>
                      <p className="text-sm text-blue-200">{user.email || 'No email'}</p>
                      <p className="text-xs text-blue-300">{user.department || 'No department'} • {user.phone || 'No phone'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>
                      {user.role}
                    </div>
                    <div className={`badge mt-1 ${user.isActive ? 'badge-success' : 'badge-secondary'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <p className="text-xs text-blue-300 mt-1">
                      {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-white/60">No recent users</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={showTicketModal}
        onClose={() => {
          setShowTicketModal(false)
          setSelectedTicket(null)
        }}
        onUpdateStatus={handleUpdateTicketStatus}
      />
    </div>
  )
}

export default Dashboard
