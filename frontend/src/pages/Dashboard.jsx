import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTicketStats } from '../redux/slices/ticketSlice'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { 
  FiTag, 
  FiClock, 
  FiCheckCircle, 
  FiUsers,
  FiTrendingUp,
  FiAlertTriangle,
  FiPlus,
  FiEye,
  FiUserCheck
} from 'react-icons/fi'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { stats, isLoading } = useSelector((state) => state.tickets)
  
  useEffect(() => {
    dispatch(getTicketStats())
  }, [dispatch])

  // Logo SVG Component (same as auth pages)
  const Logo = () => (
    <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="url(#gradient)" />
      <path d="M30 25h40a5 5 0 015 5v15a5 5 0 01-5 5H30a5 5 0 01-5-5V30a5 5 0 015-5z" fill="white" fillOpacity="0.9"/>
      <path d="M30 55h25a5 5 0 015 5v15a5 5 0 01-5 5H30a5 5 0 01-5-5V60a5 5 0 015-5z" fill="white" fillOpacity="0.7"/>
      <circle cx="70" cy="67.5" r="7.5" fill="white" fillOpacity="0.8"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  )

  // Glass Card Component
  const GlassCard = ({ children, className = "", title, icon: Icon }) => (
    <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-100 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${className}`}>
      {title && (
        <div className="p-6 pb-4 border-b border-blue-100">
          <div className="flex items-center">
            {Icon && <Icon className="w-5 h-5 text-blue-600 mr-3" />}
            <h2 className="text-lg font-semibold text-blue-900">{title}</h2>
          </div>
        </div>
      )}
      <div className={title ? "p-6 pt-4" : "p-6"}>
        {children}
      </div>
    </div>
  )

  // Stat Card Component
  const StatCard = ({ title, value, icon: Icon, color, change, trend }) => (
    <GlassCard className="group cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${
              color === 'blue' ? 'from-blue-500 to-blue-600' :
              color === 'yellow' ? 'from-blue-400 to-blue-500' :
              color === 'green' ? 'from-blue-600 to-blue-700' :
              'from-blue-700 to-blue-800'
            } shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">{title}</p>
            </div>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-blue-900">{value}</p>
            {change && (
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                trend === 'up' ? 'bg-blue-100 text-blue-800' : 
                trend === 'down' ? 'bg-blue-200 text-blue-900' : 
                'bg-blue-50 text-blue-700'
              }`}>
                {change}
              </span>
            )}
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <FiTrendingUp className="w-4 h-4 text-blue-400" />
        </div>
      </div>
    </GlassCard>
  )

  // Quick Action Button Component
  const QuickActionButton = ({ to, icon: Icon, title, description, gradient }) => (
    <Link
      to={to}
      className="block p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100 hover:bg-white/80 hover:border-blue-200 transition-all duration-200 group transform hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-semibold text-blue-900 mb-2">{title}</h3>
        <p className="text-sm text-blue-600">{description}</p>
      </div>
    </Link>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-blue-600/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-400/10 to-blue-600/10 blur-3xl"></div>
        </div>
        <div className="relative">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      </div>
    )
  }
  
  const statCards = [
    {
      title: 'Total Tickets',
      value: stats?.totalTickets || 0,
      icon: FiTag,
      color: 'blue',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Open Tickets',
      value: stats?.openTickets || 0,
      icon: FiClock,
      color: 'yellow',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Resolved Tickets',
      value: stats?.resolvedTickets || 0,
      icon: FiCheckCircle,
      color: 'green',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Avg Response Time',
      value: `${Math.round(stats?.responseTime?.avgResponseTime || 0)}h`,
      icon: FiTrendingUp,
      color: 'purple',
      change: '-2h',
      trend: 'down'
    }
  ]
  
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-blue-600/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-400/10 to-blue-600/10 blur-3xl"></div>
      </div>
      
      <div className="relative p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-blue-900">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-blue-600 mt-1">
                Here's what's happening with your tickets today
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-blue-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              change={stat.change}
              trend={stat.trend}
            />
          ))}
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status & Priority Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Breakdown */}
            {stats?.statusStats && (
              <GlassCard title="Ticket Status Overview" icon={FiTag}>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(stats.statusStats).map(([status, count]) => (
                    <div key={status} className="p-4 bg-white/70 rounded-xl border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600 capitalize">
                            {status.replace('-', ' ')}
                          </p>
                          <p className="text-2xl font-bold text-blue-900">{count}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'open' ? 'bg-blue-500' :
                          status === 'in-progress' ? 'bg-blue-400' :
                          status === 'resolved' ? 'bg-blue-600' : 'bg-blue-300'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
            
            {/* Priority Breakdown */}
            {stats?.priorityStats && (
              <GlassCard title="Priority Distribution" icon={FiAlertTriangle}>
                <div className="space-y-3">
                  {Object.entries(stats.priorityStats).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-blue-100">
                      <div className="flex items-center">
                        {priority === 'urgent' && <FiAlertTriangle className="mr-3 text-blue-600" size={16} />}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          priority === 'urgent' ? 'bg-blue-200 text-blue-800' :
                          priority === 'high' ? 'bg-blue-100 text-blue-700' :
                          priority === 'medium' ? 'bg-blue-50 text-blue-600' : 'bg-blue-50 text-blue-500'
                        }`}>
                          {priority}
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-blue-900">{count}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
          
          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <GlassCard title="Quick Actions" icon={FiPlus}>
              <div className="space-y-4">
                <QuickActionButton
                  to="/tickets/new"
                  icon={FiPlus}
                  title="Create Ticket"
                  description="Submit a new support request"
                  gradient="from-blue-500 to-indigo-600"
                />
                <QuickActionButton
                  to="/tickets"
                  icon={FiEye}
                  title="View Tickets"
                  description="Check your ticket status"
                  gradient="from-green-500 to-emerald-600"
                />
                <QuickActionButton
                  to="/profile"
                  icon={FiUserCheck}
                  title="Profile"
                  description="Update your information"
                  gradient="from-purple-500 to-violet-600"
                />
              </div>
            </GlassCard>
            
            {/* Recent Activity Card */}
            <GlassCard title="Recent Activity" icon={FiClock}>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-white/70 rounded-lg border border-blue-100">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Ticket #1234 resolved</p>
                    <p className="text-xs text-blue-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white/70 rounded-lg border border-blue-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">New ticket created</p>
                    <p className="text-xs text-blue-500">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white/70 rounded-lg border border-blue-100">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Ticket #1232 updated</p>
                    <p className="text-xs text-blue-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-sm text-blue-500">
            © 2024 QuickDesk. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
