import React from 'react'
import { useSelector } from 'react-redux'
import { FiMenu, FiBell } from 'react-icons/fi'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'

const Header = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth)
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <FiMenu size={20} />
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h1 className="text-lg font-semibold text-gray-900">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-sm text-gray-500 capitalize">
              {user?.role} Dashboard
            </p>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
              <FiBell size={20} />
            </button>
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1">
              <Badge variant="danger" size="sm">3</Badge>
            </div>
          </div>
          
          {/* User Avatar */}
          <div className="relative">
            <Avatar user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
