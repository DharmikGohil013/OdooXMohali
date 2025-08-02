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
import Card from '../components/common/Card'
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
    loadTickets()
    dispatch(getCategories())
  }, [dispatch, currentPage])

  // Load tickets with current filters
  const loadTickets = () => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: statusFilter,
      category: categoryFilter,
      priority: priorityFilter
    }
    
    // Remove empty params
    Object.keys(params).forEach(key => {
      if (!params[key]) delete params[key]
    })
    
    dispatch(getTickets(params))
  }
  
  // Handle filter changes
  useEffect(() => {
    if (currentPage === 1) {
      loadTickets()
    } else {
      setCurrentPage(1)
    }
  }, [searchTerm, statusFilter, categoryFilter, priorityFilter])
  
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
        return 'primary'
      case TICKET_PRIORITY.LOW:
        return 'gray'
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
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
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
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
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
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
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
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
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
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
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
            <div className="p-6">
              {/* Tickets Grid */}
              <div className="grid grid-cols-1 gap-4">
                {tickets.map((ticket) => (
                  <div 
                    key={ticket._id} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                            #{ticket.ticketId || ticket._id} - {ticket.subject}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={getStatusBadgeVariant(ticket.status)}
                              className="flex items-center gap-1"
                            >
                              {getStatusIcon(ticket.status)}
                              {ticket.status?.charAt(0)?.toUpperCase() + ticket.status?.slice(1)}
                            </Badge>
                            <Badge 
                              variant={getPriorityBadgeVariant(ticket.priority)}
                              className="flex items-center gap-1"
                            >
                              {getPriorityIcon(ticket.priority)}
                              {ticket.priority?.charAt(0)?.toUpperCase() + ticket.priority?.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiTag className="w-3 h-3" />
                            {categories?.find(cat => cat._id === ticket.category)?.name || 'Uncategorized'}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {formatDate ? formatDate(ticket.createdAt) : new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                          {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                            <span className="flex items-center gap-1">
                              <FiRefreshCw className="w-3 h-3" />
                              Updated {formatDate ? formatDate(ticket.updatedAt) : new Date(ticket.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => navigate(`/tickets/${ticket._id}`)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 whitespace-nowrap"
                        >
                          <FiEye className="w-4 h-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalItems)} of {pagination.totalItems} tickets
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <span className="px-3 py-1 text-sm">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tickets Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter || categoryFilter || priorityFilter
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Create your first support ticket to get started.'
                }
              </p>
              <Button
                onClick={() => navigate('/tickets/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Create New Ticket
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyTickets
