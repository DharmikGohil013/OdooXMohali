import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FiSearch, 
  FiBell, 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiTicket,
  FiClock,
  FiX,
  FiChevronDown
} from 'react-icons/fi'
import { mockTickets, mockNotifications, priorityColors } from '../../data/mockData'
import { getUserInitials } from '../../utils/navbarUtils'

const TopNavbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const searchRef = useRef(null)
  const notificationsRef = useRef(null)
  const profileRef = useRef(null)
  const searchInputRef = useRef(null)

  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  // Handle search functionality with debouncing
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    
    // Simulate API call delay
    const searchTimeout = setTimeout(() => {
      const results = mockTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Limit to 5 results for better UX
      setSearchResults(results)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
        setIsNotificationsOpen(false)
        setIsProfileOpen(false)
      }
      
      // Focus search with Ctrl/Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearchOpen(true)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setIsSearchOpen(false)
    searchInputRef.current?.blur()
  }

  // Handle ticket selection
  const handleTicketSelect = (ticketId) => {
    navigate(`/tickets/${ticketId}`)
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const iconClass = "w-4 h-4"
    switch (type) {
      case 'ticket':
        return <FiTicket className={`${iconClass} text-blue-400`} />
      case 'comment':
        return <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">💬</div>
      case 'status':
        return <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px]">📋</div>
      case 'mention':
        return <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white text-[10px] font-bold">@</div>
      case 'system':
        return <div className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center text-white text-[10px]">⚙️</div>
      case 'urgent':
        return <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px]">🚨</div>
      case 'assignment':
        return <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px]">👤</div>
      case 'deadline':
        return <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-white text-[10px]">⏰</div>
      default:
        return <FiBell className={`${iconClass} text-gray-400`} />
    }
  }

  const unreadCount = mockNotifications.filter(n => !n.isRead).length

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 lg:px-6 py-3 relative z-40">
      <div className="flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">QD</span>
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block">QuickDesk</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 relative" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="Search tickets... (Ctrl+K)"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-80 overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="py-2">
                {isSearching ? (
                  <div className="px-4 py-6 text-center text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mb-2"></div>
                    <div className="text-sm">Searching tickets...</div>
                  </div>
                ) : searchQuery.trim() === '' ? (
                  <div className="px-4 py-6 text-center text-gray-400">
                    <FiSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">Type to search tickets...</div>
                    <div className="text-xs mt-1 text-gray-500">Search by title, ID, or description</div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-xs text-gray-400 font-medium">
                      Found {searchResults.length} ticket{searchResults.length !== 1 ? 's' : ''}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {searchResults.map((ticket, index) => (
                        <button
                          key={ticket.id}
                          onClick={() => handleTicketSelect(ticket.id)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors focus:bg-gray-700 focus:outline-none"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                              <FiTicket className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-white text-sm font-medium">{ticket.id}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                                    {ticket.priority}
                                  </span>
                                </div>
                                <div className="text-gray-300 text-sm truncate mt-0.5">{ticket.title}</div>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {searchResults.length >= 5 && (
                      <div className="px-4 py-2 border-t border-gray-700 text-center">
                        <button 
                          onClick={() => navigate(`/tickets?search=${encodeURIComponent(searchQuery)}`)}
                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          View all results
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-400">
                    <FiTicket className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No tickets found</div>
                    <div className="text-xs mt-1">Try different search terms</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Notifications and Profile */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen)
                setIsProfileOpen(false)
              }}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 group"
            >
              <FiBell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="py-3 px-4 border-b border-gray-700 bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.length > 0 ? (
                    mockNotifications.slice(0, 6).map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                          !notification.isRead ? 'bg-blue-500/5 border-l-2 border-l-blue-500' : ''
                        }`}
                        onClick={() => {
                          if (notification.actionUrl) {
                            navigate(notification.actionUrl)
                            setIsNotificationsOpen(false)
                          }
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium truncate ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{notification.message}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <FiClock className="w-3 h-3 mr-1" />
                              {notification.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-400">
                      <FiBell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <div className="text-sm">No notifications</div>
                      <div className="text-xs mt-1">You're all caught up!</div>
                    </div>
                  )}
                </div>
                
                {mockNotifications.length > 0 && (
                  <div className="py-3 px-4 border-t border-gray-700 bg-gray-800/50">
                    <button 
                      onClick={() => {
                        navigate('/notifications')
                        setIsNotificationsOpen(false)
                      }}
                      className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors py-1"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen)
                setIsNotificationsOpen(false)
              }}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium group-hover:scale-105 transition-transform">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  getUserInitials(user?.name || 'User')
                )}
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-white text-sm font-medium">
                  {user?.name || 'User'}
                </span>
                <FiChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="py-3 px-4 border-b border-gray-700 bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        getUserInitials(user?.name || 'User')
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-medium text-sm truncate">{user?.name || 'User'}</div>
                      <div className="text-gray-400 text-xs truncate">{user?.email || 'user@example.com'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FiSettings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </div>
                
                <div className="py-2 border-t border-gray-700">
                  <button
                    className="flex items-center space-x-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors w-full text-left"
                    onClick={() => {
                      setIsProfileOpen(false)
                      // Add logout logic here
                      console.log('Logout clicked')
                    }}
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNavbar

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">QD</span>
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block">QuickDesk</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-4 relative" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Search tickets..."
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden">
              <div className="py-2">
                {isSearching ? (
                  <div className="px-4 py-3 text-center text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Searching...</span>
                  </div>
                ) : searchQuery.trim() === '' ? (
                  <div className="px-4 py-3 text-gray-400 text-sm">
                    Type to search tickets...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {searchResults.map((ticket) => (
                      <Link
                        key={ticket.id}
                        to={`/tickets/${ticket.id}`}
                        className="block px-4 py-3 hover:bg-gray-700 transition-colors"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FiTicket className="w-4 h-4 text-blue-400" />
                            <div>
                              <div className="text-white text-sm font-medium">{ticket.id}</div>
                              <div className="text-gray-300 text-xs truncate max-w-xs">{ticket.title}</div>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {ticket.priority}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-400">
                    <FiTicket className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No tickets found</div>
                    <div className="text-xs mt-1">Try different search terms</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Notifications and Profile */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute top-full right-0 mt-1 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="py-3 px-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-blue-400">{unreadCount} unread</span>
                    )}
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.length > 0 ? (
                    mockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors ${
                          !notification.isRead ? 'bg-blue-500/5' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <FiClock className="w-3 h-3 mr-1" />
                              {notification.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-400">
                      <FiBell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <div className="text-sm">No notifications</div>
                      <div className="text-xs mt-1">You're all caught up!</div>
                    </div>
                  )}
                </div>
                
                {mockNotifications.length > 0 && (
                  <div className="py-2 px-4 border-t border-gray-700">
                    <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  getUserInitials(user?.name || 'User')
                )}
              </div>
              <span className="text-white text-sm font-medium hidden md:block">
                {user?.name || 'User'}
              </span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="py-3 px-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        getUserInitials(user?.name || 'User')
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{user?.name || 'User'}</div>
                      <div className="text-gray-400 text-xs">{user?.email || 'user@example.com'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FiSettings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </div>
                
                <div className="py-2 border-t border-gray-700">
                  <button
                    className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors w-full text-left"
                    onClick={() => {
                      setIsProfileOpen(false)
                      // Add logout logic here
                    }}
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNavbar
