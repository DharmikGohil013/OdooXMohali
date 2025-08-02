import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  FiArrowLeft,
  FiUser, 
  FiMail, 
  FiCalendar,
  FiClock, 
  FiTag,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiMessageSquare,
  FiPaperclip,
  FiDownload,
  FiEye,
  FiEdit,
  FiSend,
  FiFlag,
  FiUserCheck,
  FiHome
} from 'react-icons/fi'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { getTicket, addComment } from '../redux/slices/ticketSlice'
import { getCategories } from '../redux/slices/categorySlice'
import { TICKET_STATUS, TICKET_PRIORITY } from '../utils/constants'
import { formatDate } from '../utils/helpers'

const TicketDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  
  const { 
    ticket, 
    isLoading, 
    error 
  } = useSelector((state) => state.tickets)
  
  const { 
    categories 
  } = useSelector((state) => state.categories)
  
  const { user } = useSelector((state) => state.auth)
  
  // Local state
  const [newComment, setNewComment] = useState('')
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [expandedAttachment, setExpandedAttachment] = useState(null)
  
  // Fetch ticket details on component mount
  useEffect(() => {
    if (id) {
      dispatch(getTicket(id))
      dispatch(getCategories())
    }
  }, [dispatch, id])
  
  const handleBack = () => {
    navigate('/tickets')
  }
  
  const handleRefresh = () => {
    if (id) {
      dispatch(getTicket(id))
    }
  }
  
  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    setIsAddingComment(true)
    try {
      await dispatch(addComment({ id, commentData: { content: newComment } }))
      setNewComment('')
      // Refresh ticket to show new comment
      dispatch(getTicket(id))
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsAddingComment(false)
    }
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case TICKET_STATUS.OPEN:
        return <FiClock className="w-5 h-5" />
      case TICKET_STATUS.IN_PROGRESS:
        return <FiRefreshCw className="w-5 h-5" />
      case TICKET_STATUS.RESOLVED:
        return <FiCheckCircle className="w-5 h-5" />
      case TICKET_STATUS.CLOSED:
        return <FiXCircle className="w-5 h-5" />
      default:
        return <FiClock className="w-5 h-5" />
    }
  }
  
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case TICKET_PRIORITY.URGENT:
        return <FiAlertCircle className="w-5 h-5 text-red-500" />
      case TICKET_PRIORITY.HIGH:
        return <FiAlertCircle className="w-5 h-5 text-orange-500" />
      case TICKET_PRIORITY.MEDIUM:
        return <FiAlertCircle className="w-5 h-5 text-yellow-500" />
      case TICKET_PRIORITY.LOW:
        return <FiAlertCircle className="w-5 h-5 text-blue-500" />
      default:
        return <FiAlertCircle className="w-5 h-5 text-gray-500" />
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
  
  const getFileIcon = (filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️'
      case 'zip':
      case 'rar':
        return '📦'
      default:
        return '📎'
    }
  }
  
  const handleDownloadAttachment = (attachment) => {
    // Create a download link
    const link = document.createElement('a')
    link.href = attachment.url || `http://localhost:5000/uploads/${attachment.filename}`
    link.download = attachment.originalName || attachment.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }
  
  const category = categories?.find(cat => cat._id === ticket?.category)

  if (isLoading && !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading ticket details..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Ticket</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleBack} variant="outline">
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Tickets
              </Button>
              <Button onClick={handleRefresh}>
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ticket Not Found</h3>
            <p className="text-gray-600 mb-4">The ticket you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleBack} variant="outline">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Tickets
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Tickets
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ticket #{ticket.ticketId || ticket._id}
              </h1>
              <p className="text-gray-600">View and manage ticket details</p>
            </div>
          </div>
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
            {(user?.role === 'admin' || user?.role === 'agent') && (
              <Button
                onClick={() => navigate(`/tickets/${ticket._id}/edit`)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <FiEdit className="w-4 h-4" />
                Edit Ticket
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {ticket.subject}
                  </h2>
                  <div className="flex items-center gap-3 mb-4">
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
                    {category && (
                      <Badge variant="gray" className="flex items-center gap-1">
                        <FiTag className="w-4 h-4" />
                        {category.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Ticket Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <div className="text-gray-900 whitespace-pre-wrap">
                  {ticket.description}
                </div>
              </div>
            </div>

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiPaperclip className="w-5 h-5" />
                  Attachments ({ticket.attachments.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ticket.attachments.map((attachment, index) => (
                    <div 
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getFileIcon(attachment.originalName || attachment.filename)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {attachment.originalName || attachment.filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownloadAttachment(attachment)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Download"
                          >
                            <FiDownload className="w-4 h-4" />
                          </button>
                          {attachment.originalName?.match(/\.(jpg|jpeg|png|gif)$/i) && (
                            <button
                              onClick={() => setExpandedAttachment(expandedAttachment === index ? null : index)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Image Preview */}
                      {expandedAttachment === index && attachment.originalName?.match(/\.(jpg|jpeg|png|gif)$/i) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <img 
                            src={attachment.url || `http://localhost:5000/uploads/${attachment.filename}`}
                            alt={attachment.originalName}
                            className="max-w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiMessageSquare className="w-5 h-5" />
                Comments ({ticket.comments?.length || 0})
              </h3>
              
              {/* Comments List */}
              <div className="space-y-4 mb-6">
                {ticket.comments && ticket.comments.length > 0 ? (
                  ticket.comments.map((comment, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(comment.user?.name || comment.createdBy?.name)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {comment.user?.name || comment.createdBy?.name || 'Unknown User'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate ? formatDate(comment.createdAt) : new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-gray-700 whitespace-pre-wrap">
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiMessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No comments yet</p>
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              {ticket.status !== TICKET_STATUS.CLOSED && (
                <form onSubmit={handleAddComment} className="border-t border-gray-200 pt-6">
                  <div className="space-y-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm resize-none transition-colors"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={!newComment.trim() || isAddingComment}
                        loading={isAddingComment}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                      >
                        <FiSend className="w-4 h-4" />
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Ticket ID</span>
                  <span className="text-sm font-mono text-gray-900">
                    #{ticket.ticketId || ticket._id}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <Badge variant={getStatusBadgeVariant(ticket.status)}>
                    {ticket.status?.charAt(0)?.toUpperCase() + ticket.status?.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Priority</span>
                  <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                    {ticket.priority?.charAt(0)?.toUpperCase() + ticket.priority?.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Category</span>
                  <span className="text-sm text-gray-900">
                    {category?.name || 'Uncategorized'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Created</span>
                  <span className="text-sm text-gray-900">
                    {formatDate ? formatDate(ticket.createdAt) : new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Last Updated</span>
                    <span className="text-sm text-gray-900">
                      {formatDate ? formatDate(ticket.updatedAt) : new Date(ticket.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Created By */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="w-5 h-5" />
                Created By
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {getInitials(ticket.createdBy?.name)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {ticket.createdBy?.name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ticket.createdBy?.role?.charAt(0)?.toUpperCase() + ticket.createdBy?.role?.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMail className="w-4 h-4" />
                    {ticket.createdBy?.email || 'No email'}
                  </div>
                  {ticket.createdBy?.department && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiHome className="w-4 h-4" />
                      {ticket.createdBy.department}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Assigned To */}
            {ticket.assignedTo && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUserCheck className="w-5 h-5" />
                  Assigned To
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                      {getInitials(ticket.assignedTo?.name)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {ticket.assignedTo?.name || 'Unknown Agent'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {ticket.assignedTo?.role?.charAt(0)?.toUpperCase() + ticket.assignedTo?.role?.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMail className="w-4 h-4" />
                      {ticket.assignedTo?.email || 'No email'}
                    </div>
                    {ticket.assignedTo?.department && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiHome className="w-4 h-4" />
                        {ticket.assignedTo.department}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetail
