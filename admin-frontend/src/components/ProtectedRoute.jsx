import React from 'react'
import { Navigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../utils/constants'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default ProtectedRoute
