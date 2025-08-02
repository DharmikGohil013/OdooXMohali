import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { login, reset } from '../../redux/slices/authSlice'
import Button from '../common/Button'
import Input from '../common/Input'
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )
  
  const { register, handleSubmit, formState: { errors } } = useForm()
  
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    
    if (isSuccess || user) {
      navigate('/dashboard')
    }
    
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])
  
  const onSubmit = (data) => {
    dispatch(login(data))
  }

  // Logo SVG Component
  const Logo = () => (
    <svg className="w-10 h-10 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="url(#gradient)" />
      <path d="M30 25h40a5 5 0 015 5v15a5 5 0 01-5 5H30a5 5 0 01-5-5V30a5 5 0 015-5z" fill="white" fillOpacity="0.9"/>
      <path d="M30 55h25a5 5 0 015 5v15a5 5 0 01-5 5H30a5 5 0 01-5-5V60a5 5 0 015-5z" fill="white" fillOpacity="0.7"/>
      <circle cx="70" cy="67.5" r="7.5" fill="white" fillOpacity="0.8"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  )

  // Help Desk Illustration SVG Component  
  const HelpDeskIllustration = () => (
    <svg className="w-64 h-48 mx-auto" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle */}
      <circle cx="200" cy="150" r="120" fill="url(#bgGradient)" fillOpacity="0.1" />
      
      {/* Desk */}
      <rect x="100" y="180" width="200" height="20" rx="10" fill="url(#deskGradient)" />
      <rect x="110" y="200" width="8" height="60" fill="#64748b" />
      <rect x="282" y="200" width="8" height="60" fill="#64748b" />
      
      {/* Computer Monitor */}
      <rect x="140" y="120" width="120" height="80" rx="8" fill="url(#monitorGradient)" />
      <rect x="150" y="130" width="100" height="60" rx="4" fill="#f1f5f9" />
      
      {/* Screen Content */}
      <rect x="160" y="140" width="80" height="3" rx="1.5" fill="#3b82f6" />
      <rect x="160" y="150" width="60" height="3" rx="1.5" fill="#94a3b8" />
      <rect x="160" y="160" width="70" height="3" rx="1.5" fill="#94a3b8" />
      <rect x="160" y="170" width="50" height="3" rx="1.5" fill="#94a3b8" />
      
      {/* Keyboard */}
      <rect x="150" y="205" width="100" height="15" rx="3" fill="#e2e8f0" />
      
      {/* Mouse */}
      <ellipse cx="270" cy="210" rx="8" ry="12" fill="#cbd5e1" />
      
      {/* Person/User */}
      <circle cx="320" cy="100" r="25" fill="url(#personGradient)" />
      <ellipse cx="320" cy="140" rx="20" ry="30" fill="url(#personGradient)" />
      <rect x="310" y="125" width="20" height="35" rx="10" fill="#3b82f6" />
      
      {/* Speech Bubble */}
      <ellipse cx="350" cy="80" rx="30" ry="20" fill="white" stroke="#3b82f6" strokeWidth="2" />
      <path d="M335 95 L325 105 L340 100 Z" fill="white" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="340" cy="75" r="2" fill="#3b82f6" />
      <circle cx="350" cy="75" r="2" fill="#3b82f6" />
      <circle cx="360" cy="75" r="2" fill="#3b82f6" />
      
      {/* Floating Elements */}
      <rect x="80" y="60" width="30" height="20" rx="4" fill="#fbbf24" fillOpacity="0.8" />
      <circle cx="95" cy="70" r="2" fill="white" />
      <rect x="88" y="75" width="14" height="2" rx="1" fill="white" />
      
      <circle cx="360" cy="180" r="12" fill="#ef4444" fillOpacity="0.8" />
      <rect x="356" y="176" width="8" height="2" rx="1" fill="white" />
      <rect x="356" y="180" width="8" height="2" rx="1" fill="white" />
      <rect x="356" y="184" width="8" height="2" rx="1" fill="white" />
      
      {/* Ticket Icons */}
      <rect x="60" y="120" width="25" height="30" rx="3" fill="white" stroke="#3b82f6" strokeWidth="2" />
      <rect x="65" y="125" width="15" height="2" rx="1" fill="#3b82f6" />
      <rect x="65" y="130" width="10" height="2" rx="1" fill="#94a3b8" />
      <rect x="65" y="135" width="12" height="2" rx="1" fill="#94a3b8" />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="deskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="monitorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
        <linearGradient id="personGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  )
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-white/10 -translate-x-24 -translate-y-24"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-32 translate-y-32"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-white/5"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-sm">
            <div className="mb-6">
              <HelpDeskIllustration />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Welcome to QuickDesk
            </h2>
            <p className="text-blue-100 leading-relaxed">
              Your comprehensive help desk solution for streamlined support and customer satisfaction.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-sm">
            {/* Logo and Header */}
            <div className="text-center mb-6">
              <div className="mb-4">
                <Logo />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back
              </h1>
              <p className="text-gray-600 text-sm">
                Sign in to your QuickDesk account
              </p>
            </div>
            
            {/* Login Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address'
                        }
                      })}
                      className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-colors bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm ${
                        errors.email ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Password is required'
                      })}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-lg border transition-colors bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm ${
                        errors.password ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm mt-6"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
                
                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
            
            {/* Footer */}
            <div className="text-center mt-6 text-xs text-gray-500">
              © 2024 QuickDesk. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
