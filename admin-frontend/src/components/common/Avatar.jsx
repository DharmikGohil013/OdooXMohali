import React from 'react'
import clsx from 'clsx'
import { getInitials } from '../../utils/helpers'

const Avatar = ({
  src,
  name,
  size = 'md',
  className = '',
  online = false,
  ...props
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  }

  const onlineIndicatorSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5'
  }

  return (
    <div className={clsx('relative inline-block', className)} {...props}>
      <div
        className={clsx(
          'rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold overflow-hidden',
          sizeClasses[size]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name || 'U')}</span>
        )}
      </div>
      
      {online && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 bg-green-400 border-2 border-white rounded-full',
            onlineIndicatorSizes[size]
          )}
        />
      )}
    </div>
  )
}

export default Avatar
