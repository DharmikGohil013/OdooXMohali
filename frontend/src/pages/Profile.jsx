import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { getMe, updateProfile, changePassword, reset } from '../redux/slices/authSlice'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiLock,
  FiEye,
  FiEyeOff,
  FiCamera,
  FiCheck
} from 'react-icons/fi'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )
  
  // Form for profile update
  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile, 
    formState: { errors: profileErrors },
    setValue,
    watch,
    reset: resetProfile
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || ''
    }
  })
  
  // Form for password change
  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword
  } = useForm()

  // Logo SVG Component (same as auth pages)
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

  // Glass Card Component (blue theme for layout)
  const GlassCard = ({ children, className = "" }) => (
    <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-100 transform transition-all duration-300 hover:shadow-2xl ${className}`}>
      {children}
    </div>
  )

  useEffect(() => {
    // Fetch current user data on component mount
    dispatch(getMe())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '')
      setValue('email', user.email || '')
      setValue('phone', user.phone || '')
      setValue('bio', user.bio || '')
    }
  }, [user, setValue])

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    
    if (isSuccess && (isEditing || isChangingPassword)) {
      if (isEditing) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      }
      if (isChangingPassword) {
        toast.success('Password changed successfully!')
        setIsChangingPassword(false)
        resetPassword()
      }
    }
    
    dispatch(reset())
  }, [isError, isSuccess, message, dispatch, resetProfile, resetPassword, isEditing, isChangingPassword])

  const onSubmitProfile = (data) => {
    dispatch(updateProfile(data))
  }

  const onSubmitPassword = (data) => {
    dispatch(changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    }))
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsChangingPassword(false)
    resetProfile()
    resetPassword()
    // Reset form values to original user data
    if (user) {
      setValue('name', user.name || '')
      setValue('email', user.email || '')
      setValue('phone', user.phone || '')
      setValue('bio', user.bio || '')
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Generate avatar initials
  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    )
  }

  const newPassword = watchPassword('newPassword')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
                      {avatarPreview || user?.avatar ? (
                        <img 
                          src={avatarPreview || user?.avatar} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <FiCamera className="w-6 h-6 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {isEditing ? 'Click to change avatar' : `${user?.role?.charAt(0)?.toUpperCase()}${user?.role?.slice(1)} Account`}
                  </p>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-blue-700">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-blue-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        {...registerProfile('name', {
                          required: 'Name is required',
                          minLength: { value: 2, message: 'Name must be at least 2 characters' }
                        })}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                          isEditing 
                            ? 'focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none' 
                            : 'bg-blue-50 border-blue-200 cursor-not-allowed'
                        } ${
                          profileErrors.name ? 'border-red-300' : 'border-blue-200 hover:border-blue-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {profileErrors.name && (
                      <p className="text-red-500 text-sm">{profileErrors.name.message}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-blue-700">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-blue-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        {...registerProfile('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email address'
                          }
                        })}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                          isEditing 
                            ? 'focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none' 
                            : 'bg-blue-50 border-blue-200 cursor-not-allowed'
                        } ${
                          profileErrors.email ? 'border-red-300' : 'border-blue-200 hover:border-blue-300'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {profileErrors.email && (
                      <p className="text-red-500 text-sm">{profileErrors.email.message}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-blue-700">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="h-5 w-5 text-blue-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="tel"
                        {...registerProfile('phone')}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                          isEditing 
                            ? 'focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none' 
                            : 'bg-blue-50 border-blue-200 cursor-not-allowed'
                        } border-blue-200 hover:border-blue-300`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Role Field (Read-only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-blue-700">
                      Account Role
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1) || 'User'}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border-2 bg-blue-50 border-blue-200 cursor-not-allowed text-blue-600"
                      />
                    </div>
                    <p className="text-xs text-blue-500">Contact admin to change your role</p>
                  </div>
                </div>

                {/* Bio Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-700">
                    Bio (Optional)
                  </label>
                  <textarea
                    {...registerProfile('bio')}
                    disabled={!isEditing}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white/70 backdrop-blur-sm resize-none ${
                      isEditing 
                        ? 'focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none' 
                        : 'bg-blue-50 border-blue-200 cursor-not-allowed'
                    } border-blue-200 hover:border-blue-300`}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      type="submit"
                      loading={isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                    >
                      <FiSave className="w-5 h-5 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <FiX className="w-5 h-5 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </GlassCard>
          </div>

          {/* Security Card */}
          <div className="space-y-6">
            {/* Account Details */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                  <span className="text-sm text-blue-600">Account Status</span>
                  <span className="flex items-center text-blue-700 text-sm font-medium">
                    <FiCheck className="w-4 h-4 mr-1" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                  <span className="text-sm text-blue-600">Member Since</span>
                  <span className="text-sm font-medium text-blue-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                  <span className="text-sm text-blue-600">Last Updated</span>
                  <span className="text-sm font-medium text-blue-900">
                    {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Password Change */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-900">Security</h3>
                {!isChangingPassword && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center"
                  >
                    <FiLock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                )}
              </div>

              {isChangingPassword ? (
                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-blue-700">
                      Current Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-blue-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        {...registerPassword('currentPassword', {
                          required: 'Current password is required'
                        })}
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200 bg-white/70 backdrop-blur-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none ${
                          passwordErrors.currentPassword ? 'border-red-300' : 'border-blue-200 hover:border-blue-300'
                        }`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600"
                      >
                        {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-sm">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-blue-700">
                      New Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-blue-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        {...registerPassword('newPassword', {
                          required: 'New password is required',
                          minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })}
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200 bg-white/70 backdrop-blur-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none ${
                          passwordErrors.newPassword ? 'border-red-300' : 'border-blue-200 hover:border-blue-300'
                        }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600"
                      >
                        {showNewPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-sm">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-blue-700">
                      Confirm New Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-blue-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...registerPassword('confirmPassword', {
                          required: 'Please confirm your new password',
                          validate: value => value === newPassword || 'Passwords do not match'
                        })}
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200 bg-white/70 backdrop-blur-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none ${
                          passwordErrors.confirmPassword ? 'border-red-300' : 'border-blue-200 hover:border-blue-300'
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600"
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-sm">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Password Action Buttons */}
                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      type="submit"
                      loading={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                    >
                      <FiSave className="w-4 h-4 mr-2" />
                      Update Password
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                    <span className="text-sm text-blue-600">Password</span>
                    <span className="text-sm text-blue-900">••••••••</span>
                  </div>
                  <p className="text-xs text-blue-500">
                    Keep your account secure with a strong password
                  </p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
