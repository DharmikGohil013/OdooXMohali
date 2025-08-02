import React from 'react'
import { 
  FiHome, 
  FiTag, 
  FiUsers, 
  FiFolder, 
  FiUser, 
  FiSettings,
  FiPlus,
  FiBarChart2
} from 'react-icons/fi'

const iconMap = {
  dashboard: FiBarChart2,
  tickets: FiTag,
  users: FiUsers,
  category: FiFolder,
  user: FiUser,
  settings: FiSettings,
  plus: FiPlus,
  home: FiHome
}

const Icon = ({ 
  name, 
  size = 20, 
  className = '', 
  ...props 
}) => {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }
  
  return (
    <IconComponent 
      size={size} 
      className={className} 
      {...props} 
    />
  )
}

export default Icon
