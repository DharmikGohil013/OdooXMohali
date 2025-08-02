import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiEye, 
  FiClock, 
  FiTag,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw
} from 'react-icons/fi'
          </div>
        </div>
        
        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">{t Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { getTickets } from '../redux/slices/ticketSlice'
import { getCategories } from '../redux/slices/categorySlice'
import { TICKET_STATUS, TICKET_PRIORITY, STATUS_OPTIONS, PRIORITY_OPTIONS } from '../utils/constants'
import { formatDate, getStatusColor, getPriorityColor } from '../utils/helpers'

const MyTickets = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { 
    tickets, 
    isLoading, 
    error, 
    pagination 
  } = useSelector((state) => state.tickets)
  
  const { 
    categories 
  } = useSelector((state) => state.categories)
  
  const { user } = useSelector((state) => state.auth)
  
  // Local state for filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Fetch tickets and categories on component mount
  useEffect(() => {
    dispatch(getCategories())
    loadTickets()
  }, [dispatch, currentPage, statusFilter, categoryFilter, priorityFilter, searchTerm])
  
  // Calculate ticket statistics
  const ticketStats = React.useMemo(() => {
    if (!tickets || tickets.length === 0) {
      return {
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0
      }
    }
    
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === TICKET_STATUS.OPEN).length,
      inProgress: tickets.filter(t => t.status === TICKET_STATUS.IN_PROGRESS).length,
      resolved: tickets.filter(t => t.status === TICKET_STATUS.RESOLVED).length,
      closed: tickets.filter(t => t.status === TICKET_STATUS.CLOSED).length
    }
  }, [tickets])
  
  const loadTickets = () => {
    const filters = {
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: statusFilter,
      category: categoryFilter,
      priority: priorityFilter
    }
    
    // For regular users, only show their own tickets
    if (user?.role === 'user') {
      filters.myTickets = 'true'
    }
    
    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (!filters[key] || filters[key] === '') {
        delete filters[key]
      }
    })
    
    dispatch(getTickets(filters))
  }
  
  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    loadTickets()
  }
  
  const handleRefresh = () => {
    loadTickets()
  }
  
  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setCategoryFilter('')
    setPriorityFilter('')
    setCurrentPage(1)
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case TICKET_STATUS.OPEN:
        return <FiClock className="w-4 h-4" />
      case TICKET_STATUS.IN_PROGRESS:
        return <FiRefreshCw className="w-4 h-4" />
      case TICKET_STATUS.RESOLVED:
        return <FiCheckCircle className="w-4 h-4" />
      case TICKET_STATUS.CLOSED:
        return <FiXCircle className="w-4 h-4" />
      default:
        return <FiClock className="w-4 h-4" />
    }
  }
  
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case TICKET_PRIORITY.URGENT:
        return <FiAlertCircle className="w-4 h-4 text-red-500" />
      case TICKET_PRIORITY.HIGH:
        return <FiAlertCircle className="w-4 h-4 text-orange-500" />
      case TICKET_PRIORITY.MEDIUM:
        return <FiAlertCircle className="w-4 h-4 text-yellow-500" />
      case TICKET_PRIORITY.LOW:
        return <FiAlertCircle className="w-4 h-4 text-blue-500" />
      default:
        return <FiAlertCircle className="w-4 h-4 text-gray-500" />
    }
  }
  
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case TICKET_STATUS.OPEN:
        return 'primary'
      case TICKET_STATUS.IN_PROGRESS:
        return 'warning'
      case TICKET_STATUS.RESOLVED:
        return 'success'
      case TICKET_STATUS.CLOSED:
        return 'gray'
      default:
        return 'gray'
    }
  }
  
  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case TICKET_PRIORITY.URGENT:
        return 'danger'
      case TICKET_PRIORITY.HIGH:
        return 'warning'
      case TICKET_PRIORITY.MEDIUM:
        return 'warning'
      case TICKET_PRIORITY.LOW:
        return 'primary'
      default:
        return 'gray'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.role === 'user' ? 'My Tickets' : 'All Tickets'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'user' 
              ? 'View and track your support requests' 
              : 'View and manage all support tickets'
            }
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/tickets/new')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                New Ticket
              </Button>
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-colors"
                  placeholder="Search tickets by title, description, or ticket ID..."
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <FiFilter className="w-4 h-4" />
                Filters
              </Button>
            </form>
          
          {/* Filter Controls */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="">All Statuses</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="">All Priorities</option>
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="">All Categories</option>
                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Tickets List */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Tickets</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        ) : tickets && tickets.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr 
                      key={ticket._id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/tickets/${ticket._id}`)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {ticket.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            #{ticket.ticketId || ticket._id.slice(-6)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FiTag className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {ticket.category?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(ticket.priority)}
                          <Badge variant={getPriorityBadgeVariant(ticket.priority)} size="sm">
                            {ticket.priority}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ticket.status)}
                          <Badge variant={getStatusBadgeVariant(ticket.status)} size="sm">
                            {ticket.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(ticket.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/tickets/${ticket._id}`)
                          }}
                          className="flex items-center gap-1"
                        >
                          <FiEye className="w-4 h-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  onClick={() => navigate(`/tickets/${ticket._id}`)}
                  className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1 truncate">
                        {ticket.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        #{ticket.ticketId || ticket._id.slice(-6)}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(ticket.status)} size="sm">
                      {ticket.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FiTag className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {ticket.category?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(ticket.priority)}
                        <span className="text-gray-600 capitalize">
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <span className="text-gray-500">
                      {formatDate(ticket.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.total)} of {pagination.total} tickets
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <span className="px-3 py-1 text-sm text-gray-600">
                    Page {currentPage} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                    disabled={currentPage === pagination.pages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiClock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tickets Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter || categoryFilter || priorityFilter
                ? "No tickets match your current filters. Try adjusting your search criteria."
                : "You haven't created any support tickets yet."
              }
            </p>
            <div className="flex items-center justify-center gap-3">
              {(searchTerm || statusFilter || categoryFilter || priorityFilter) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
              <Button onClick={() => navigate('/tickets/create')}>
                Create Your First Ticket
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default MyTickets
