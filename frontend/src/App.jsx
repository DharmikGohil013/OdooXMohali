import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './redux/slices/authSlice'

// Layout Components
import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'

// Auth Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'

// Page Components
import Dashboard from './pages/Dashboard'
import TicketList from './pages/TicketList'
import TicketDetail from './pages/TicketDetail'
import CreateTicket from './pages/CreateTicket'
import Profile from './pages/Profile'
import UserList from './pages/UserList'
import CategoryList from './pages/CategoryList'

// Demo Components
import CreateTicketDemo from './components/CreateTicketDemo'

// Utils
import { ROUTES } from './utils/constants'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, token } = useSelector((state) => state.auth)
  
  if (!token || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }
  
  return children
}

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth)
  
  if (token && user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }
  
  return children
}

function App() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  
  useEffect(() => {
    // Check if user is logged in and get user data
    if (token) {
      dispatch(getMe())
    }
  }, [dispatch, token])
  
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        
        {/* Create Ticket Demo Route - Accessible without authentication */}
        <Route path="/create-ticket-demo" element={<CreateTicketDemo />} />
        
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          <Route path="reset-password/:resettoken" element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } />
        </Route>
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/reset-password/:resettoken" element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Ticket Routes */}
          <Route path="tickets" element={<TicketList />} />
          <Route path="tickets/new" element={<CreateTicket />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          
          {/* Profile Route */}
          <Route path="profile" element={<Profile />} />
          
          {/* Admin/Agent Routes */}
          <Route path="users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserList />
            </ProtectedRoute>
          } />
          
          <Route path="categories" element={
            <ProtectedRoute allowedRoles={['admin', 'agent']}>
              <CategoryList />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-4">Page not found</p>
              <a href="/dashboard" className="text-primary-600 hover:text-primary-500">
                Go back to dashboard
              </a>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
