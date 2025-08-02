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
  
  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        </div>
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600">QuickDesk</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    nav-link
                    ${isActive ? 'nav-link-active' : 'nav-link-inactive'}
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
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <Avatar user={user} showName />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
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
