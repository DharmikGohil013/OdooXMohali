import React from 'react'
import { getInitials, getAvatarColor } from '../../utils/helpers'

const Avatar = ({ 
  user, 
  size = 'md', 
  className = '',
  showName = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  }
  
  const initials = user ? getInitials(user.name) : '??'
  const backgroundColor = user ? getAvatarColor(user.name) : 'bg-gray-500'
  
  return (
    <div className={`flex items-center ${className}`}>
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className={`rounded-full object-cover ${sizeClasses[size]}`}
        />
      ) : (
        <div
          className={`rounded-full ${backgroundColor} ${sizeClasses[size]} flex items-center justify-center text-white font-medium`}
        >
          {initials}
        </div>
      )}
      {showName && user && (
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          {user.email && (
            <p className="text-xs text-gray-500">{user.email}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Avatar
