import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm }             {/* Logo and Header */}
            <div className="text-center mb-6">
              <div className="mb-4">
                <Logo />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-600 text-sm">
                Join QuickDesk and get support when you need it
              </p>
            </div>
            
            {/* Register Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">-form'
import { toast } from 'react-toastify'
import { register as registerUser, reset } from '../../redux/slices/authSlice'
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiUsers, FiPhone } from 'react-icons/fi'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const watchPassword = watch('password')
  
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    
    if (isSuccess || user) {
      navigate('/dashboard')
      toast.success('Account created successfully!')
    }
    
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])
  
  const onSubmit = (data) => {
    const { confirmPassword, ...userData } = data
    dispatch(registerUser(userData))
  }

  // Logo SVG Component (same as Login)
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
  )

  // Input Field Component
  const FormField = React.forwardRef(({ label, icon: Icon, type = "text", error, children, ...props }, ref) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          ref={ref}
          type={type}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white/50 backdrop-blur-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none ${
            error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
          }`}
          {...props}
        />
        {children}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
          {error}
        </p>
      )}
    </div>
  ))

  // Security Illustration SVG
  const SecurityIllustration = () => (
    <svg className="w-full h-full max-w-lg max-h-96" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle */}
      <circle cx="200" cy="150" r="120" fill="url(#bgGradient)" fillOpacity="0.1" />
      
      {/* Shield Base */}
      <path d="M200 80 L240 100 L240 160 Q240 180 200 200 Q160 180 160 160 L160 100 L200 80 Z" fill="url(#shieldGradient)" />
      <path d="M200 90 L230 105 L230 155 Q230 170 200 185 Q170 170 170 155 L170 105 L200 90 Z" fill="white" fillOpacity="0.9" />
      
      {/* Checkmark */}
      <path d="M185 140 L195 150 L215 130" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* User Icons Around Shield */}
      <circle cx="120" cy="120" r="15" fill="url(#userGradient)" />
      <rect x="115" y="135" width="10" height="15" rx="5" fill="#3b82f6" />
      
      <circle cx="280" cy="120" r="15" fill="url(#userGradient)" />
      <rect x="275" y="135" width="10" height="15" rx="5" fill="#3b82f6" />
      
      <circle cx="120" cy="200" r="15" fill="url(#userGradient)" />
      <rect x="115" y="215" width="10" height="15" rx="5" fill="#3b82f6" />
      
      <circle cx="280" cy="200" r="15" fill="url(#userGradient)" />
      <rect x="275" y="215" width="10" height="15" rx="5" fill="#3b82f6" />
      
      {/* Connection Lines */}
      <line x1="135" y1="125" x2="185" y2="145" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
      <line x1="265" y1="125" x2="215" y2="145" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
      <line x1="135" y1="205" x2="185" y2="185" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
      <line x1="265" y1="205" x2="215" y2="185" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
      
      {/* Floating Security Elements */}
      <circle cx="80" cy="80" r="8" fill="#fbbf24" />
      <rect x="76" y="76" width="8" height="2" rx="1" fill="white" />
      <rect x="76" y="80" width="8" height="2" rx="1" fill="white" />
      <rect x="76" y="84" width="8" height="2" rx="1" fill="white" />
      
      <rect x="310" y="70" width="16" height="20" rx="2" fill="#ef4444" />
      <circle cx="318" cy="80" r="3" fill="white" />
      <rect x="315" y="85" width="6" height="1" rx="0.5" fill="white" />
      
      {/* Lock Icons */}
      <rect x="60" y="220" width="12" height="16" rx="2" fill="#374151" />
      <rect x="63" y="217" width="6" height="6" rx="3" fill="none" stroke="#374151" strokeWidth="2" />
      
      <rect x="330" y="220" width="12" height="16" rx="2" fill="#10b981" />
      <rect x="333" y="217" width="6" height="6" rx="3" fill="none" stroke="#10b981" strokeWidth="2" />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  )

  FormField.displayName = 'FormField'
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 translate-x-24 -translate-y-24"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-32 translate-y-32"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/5"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-sm">
            <div className="mb-6">
              <SecurityIllustration />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Join QuickDesk Today
            </h2>
            <p className="text-indigo-100 leading-relaxed">
              Create your account and start managing support tickets with our secure, powerful platform.
            </p>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-sm">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="mb-6">
                <Logo />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-600">
                Join QuickDesk and streamline your support
              </p>
            </div>
            
            {/* Register Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform transition-all duration-300 hover:shadow-2xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name Field */}
                <FormField
                  label="Full Name"
                  icon={FiUser}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  error={errors.name?.message}
                  placeholder="Enter your full name"
                />

                {/* Email Field */}
                <FormField
                  label="Email Address"
                  icon={FiMail}
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address'
                    }
                  })}
                  error={errors.email?.message}
                  placeholder="Enter your email"
                />

                {/* Department Field */}
                <FormField
                  label="Department (Optional)"
                  icon={FiUsers}
                  {...register('department')}
                  placeholder="Enter your department"
                />

                {/* Phone Field */}
                <FormField
                  label="Phone Number (Optional)"
                  icon={FiPhone}
                  type="tel"
                  {...register('phone')}
                  placeholder="Enter your phone number"
                />

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
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value =>
                          value === watchPassword || 'Passwords do not match'
                      })}
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl mt-6"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
                
                {/* Sign In Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                    >
                      Sign in here
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

export default Register
