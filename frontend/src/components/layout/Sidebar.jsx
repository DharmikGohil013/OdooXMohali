import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../../redux/slices/authSlice'
import { NAVIGATION } from '../../utils/constants'
import Icon from '../common/Icon'
import Avatar from '../common/Avatar'
import { FiX, FiLogOut } from 'react-icons/fi'

const Sidebar = ({ open, onClose }) => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  
  const navigation = NAVIGATION[user?.role?.toUpperCase()] || NAVIGATION.USER
  
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  // Logo SVG Component
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
  
  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-blue-900 bg-opacity-50" onClick={onClose} />
        </div>
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-blue-700">
          <div className="flex items-center">
            <Logo />
            <h1 className="ml-3 text-xl font-bold text-white">QuickDesk</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <nav className="mt-4 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                    }
                  `}
                  onClick={onClose}
                >
                  <Icon name={item.icon} size={18} className="mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
        
        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-blue-700">
          <div className="flex items-center mb-3 px-3 py-2 bg-blue-800 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-blue-200 capitalize">{user?.role || 'user'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-blue-100 rounded-lg hover:bg-blue-700 hover:text-white transition-colors"
          >
            <FiLogOut size={18} className="mr-3" />
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
