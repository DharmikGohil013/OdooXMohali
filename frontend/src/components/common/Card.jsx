import React from 'react'
import clsx from 'clsx'

const Card = ({ 
  children, 
  className = '', 
  title, 
  actions,
  padding = true,
  ...props 
}) => {
  return (
    <div className={clsx('card', className)} {...props}>
      {title && (
        <div className="card-header flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div className={clsx(padding && 'card-body', !padding && 'p-0')}>
        {children}
      </div>
    </div>
  )
}

export default Card
