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
    <svg className="w-12 h-12 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  // Help Desk Illustration SVG
  const HelpDeskIllustration = () => (
    <svg className="w-full h-full max-w-lg max-h-96" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle */}
      <circle cx="200" cy="150" r="120" fill="url(#bgGradient)" fillOpacity="0.1" />
      
      {/* Desk */}
      <rect x="100" y="180" width="200" height="20" rx="10" fill="url(#deskGradient)" />
      <rect x="110" y="200" width="8" height="60" fill="#64748b" />
      <rect x="282" y="200" width="8" height="60" fill="#64748b" />
      
      {/* Computer Monitor */}
      <rect x="140" y="120" width="120" height="80" rx="8" fill="url(#monitorGradient)" />
      <rect x="150" y="130" width="100" height="60" rx="4" fill="#f1f5f9" />
      
      {/* Monitor Content - Help Desk Interface */}
      <rect x="155" y="135" width="90" height="8" rx="2" fill="#3b82f6" />
      <rect x="155" y="148" width="60" height="4" rx="2" fill="#94a3b8" />
      <rect x="155" y="156" width="70" height="4" rx="2" fill="#94a3b8" />
      <circle cx="235" cy="170" r="8" fill="#10b981" />
      <rect x="220" y="175" width="30" height="3" rx="1" fill="#10b981" />
      
      {/* Monitor Stand */}
      <rect x="190" y="200" width="20" height="15" rx="2" fill="#64748b" />
      <rect x="180" y="215" width="40" height="8" rx="4" fill="#64748b" />
      
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
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  )
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/10 -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-48 translate-y-48"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-white/5"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="mb-8">
              <HelpDeskIllustration />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to QuickDesk
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed max-w-md">
              Your comprehensive help desk solution for streamlined support and customer satisfaction.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="mb-6">
                <Logo />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back
              </h1>
              <p className="text-gray-600">
                Sign in to your QuickDesk account
              </p>
            </div>
            
            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform transition-all duration-300 hover:shadow-2xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
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
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none ${
                        errors.email ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Password is required'
                      })}
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none ${
                        errors.password ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.password.message}
                    </p>
                  )}
                </div>
                
                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                  >
                    Forgot your password?
                  </Link>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
                
                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="font-semibold text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
            
            {/* Footer */}
            <div className="text-center mt-8 text-sm text-gray-500">
              © 2024 QuickDesk. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
