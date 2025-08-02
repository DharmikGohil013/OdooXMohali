import React from 'react'
import { useSelector } from 'react-redux'
import { FiMenu, FiSearch } from 'react-icons/fi'

const Header = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth)
  
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 lg:hidden"
          >
            <FiMenu size={20} />
          </button>
          
          {/* Search */}
          <div className="hidden md:block ml-4 lg:ml-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={16} />
              <input
                type="text"
                placeholder="Search tickets..."
                className="pl-10 pr-4 py-2 w-80 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50/50 placeholder-blue-400"
              />
            </div>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* User info */}
          <div className="flex items-center">
            <div className="hidden sm:block text-right mr-3">
              <p className="text-sm font-medium text-blue-800">{user?.name || 'User'}</p>
              <p className="text-xs text-blue-500 capitalize">{user?.role || 'user'}</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
