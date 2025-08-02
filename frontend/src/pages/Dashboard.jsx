import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTicketStats } from '../redux/slices/ticketSlice'
import Card from '../components/common/Card'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Badge from '../components/common/Badge'
import { 
  FiTag, 
  FiClock, 
  FiCheckCircle, 
  FiUsers,
  FiTrendingUp,
  FiAlertTriangle
} from 'react-icons/fi'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { stats, isLoading } = useSelector((state) => state.tickets)
  
  useEffect(() => {
    dispatch(getTicketStats())
  }, [dispatch])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }
  
  const statCards = [
    {
      title: 'Total Tickets',
      value: stats?.totalTickets || 0,
      icon: FiTag,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Open Tickets',
      value: stats?.openTickets || 0,
      icon: FiClock,
      color: 'yellow',
      change: '+5%'
    },
    {
      title: 'Resolved Tickets',
      value: stats?.resolvedTickets || 0,
      icon: FiCheckCircle,
      color: 'green',
      change: '+8%'
    },
    {
      title: 'Avg Response Time',
      value: `${Math.round(stats?.responseTime?.avgResponseTime || 0)}h`,
      icon: FiTrendingUp,
      color: 'purple',
      change: '-2h'
    }
  ]
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-primary-100">
          Here's what's happening with your tickets today.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <Badge 
                    variant={stat.change.startsWith('+') ? 'success' : 'warning'}
                    className="ml-2"
                    size="sm"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Status Breakdown */}
      {stats?.statusStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Ticket Status Breakdown">
            <div className="space-y-4">
              {Object.entries(stats.statusStats).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant={
                      status === 'open' ? 'primary' :
                      status === 'in-progress' ? 'warning' :
                      status === 'resolved' ? 'success' : 'gray'
                    }>
                      {status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <span className="text-lg font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </Card>
          
          <Card title="Priority Breakdown">
            <div className="space-y-4">
              {Object.entries(stats?.priorityStats || {}).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {priority === 'urgent' && <FiAlertTriangle className="mr-2 text-red-500" />}
                    <Badge variant={
                      priority === 'urgent' ? 'danger' :
                      priority === 'high' ? 'warning' :
                      priority === 'medium' ? 'primary' : 'gray'
                    }>
                      {priority}
                    </Badge>
                  </div>
                  <span className="text-lg font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      
      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/tickets/new"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
          >
            <FiTag className="mx-auto mb-2 text-primary-600" size={24} />
            <h3 className="font-medium text-gray-900">Create Ticket</h3>
            <p className="text-sm text-gray-500">Submit a new support request</p>
          </a>
          
          <a
            href="/tickets"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
          >
            <FiClock className="mx-auto mb-2 text-primary-600" size={24} />
            <h3 className="font-medium text-gray-900">View Tickets</h3>
            <p className="text-sm text-gray-500">Check your ticket status</p>
          </a>
          
          <a
            href="/profile"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
          >
            <FiUsers className="mx-auto mb-2 text-primary-600" size={24} />
            <h3 className="font-medium text-gray-900">Profile</h3>
            <p className="text-sm text-gray-500">Update your information</p>
          </a>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
