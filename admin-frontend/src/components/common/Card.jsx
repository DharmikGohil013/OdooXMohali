import React from 'react'
import clsx from 'clsx'

const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  shadow = 'lg',
  hover = false,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }

  return (
    <div
      className={clsx(
        'card bg-white rounded-xl border border-gray-100 overflow-hidden',
        shadowClasses[shadow],
        paddingClasses[padding],
        hover && 'hover:shadow-xl transition-shadow duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Card components
Card.Header = ({ children, className = '', ...props }) => (
  <div className={clsx('border-b border-gray-200 pb-4 mb-4', className)} {...props}>
    {children}
  </div>
)

Card.Title = ({ children, className = '', ...props }) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900', className)} {...props}>
    {children}
  </h3>
)

Card.Subtitle = ({ children, className = '', ...props }) => (
  <p className={clsx('text-sm text-gray-600 mt-1', className)} {...props}>
    {children}
  </p>
)

Card.Content = ({ children, className = '', ...props }) => (
  <div className={clsx('text-gray-700', className)} {...props}>
    {children}
  </div>
)

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={clsx('border-t border-gray-200 pt-4 mt-4', className)} {...props}>
    {children}
  </div>
)

export default Card
