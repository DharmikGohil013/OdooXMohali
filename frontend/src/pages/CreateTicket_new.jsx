import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiUpload, FiX, FiFile, FiCheck, FiAlertCircle, FiEdit, FiTag, FiFlag } from 'react-icons/fi'
import { createTicket } from '../redux/slices/ticketSlice'
import { getCategories } from '../redux/slices/categorySlice'
import { PRIORITY_OPTIONS, API_CONFIG } from '../utils/constants'

const CreateTicket = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { 
    isLoading: ticketLoading, 
    isError: ticketError,
    isSuccess: ticketSuccess,
    message: errorMessage
  } = useSelector((state) => state.tickets)
  
  const { 
    categories, 
    isLoading: categoriesLoading 
  } = useSelector((state) => state.categories)
  
  const [attachments, setAttachments] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      subject: '',
      description: '',
      category: '',
      priority: 'medium'
    }
  })

  // Load categories on component mount
  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])

  // Handle successful ticket creation
  useEffect(() => {
    if (ticketSuccess && !ticketLoading) {
      setShowSuccess(true)
      
      // Clear form and attachments
      reset()
      setAttachments([])
      
      // Hide success message and redirect after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        navigate('/tickets')
      }, 3000)
    }
  }, [ticketSuccess, ticketLoading, reset, navigate])

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).filter(file => {
      // Check file size
      if (file.size > API_CONFIG.MAX_FILE_SIZE) {
        alert(`File "${file.name}" is too large. Maximum size is ${API_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB.`)
        return false
      }
      
      // Check file type
      const fileExtension = file.name.split('.').pop().toLowerCase()
      if (!API_CONFIG.ALLOWED_FILE_TYPES.includes(fileExtension)) {
        alert(`File type "${fileExtension}" is not allowed. Allowed types: ${API_CONFIG.ALLOWED_FILE_TYPES.join(', ')}`)
        return false
      }
      
      return true
    })

    setAttachments(prev => [...prev, ...newFiles])
  }

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      attachments: attachments
    }

    try {
      await dispatch(createTicket(formData)).unwrap()
    } catch (error) {
      console.error('Failed to create ticket:', error)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Logo SVG Component (matching Login page)
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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Created Successfully!</h2>
          <p className="text-gray-600 mb-4">Your support request has been submitted and you'll receive updates via email.</p>
          <div className="text-sm text-gray-500">Redirecting to tickets list...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg">
          {/* Logo and Header */}
          <div className="text-center mb-6">
            <div className="mb-4">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Create Support Ticket
            </h1>
            <p className="text-gray-600 text-sm">
              Tell us about your issue and we'll get back to you as soon as possible
            </p>
          </div>
          
          {/* Main Form Card - matching Login page styling exactly */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Subject Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiEdit className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('subject', { 
                      required: 'Subject is required',
                      minLength: { value: 3, message: 'Subject must be at least 3 characters' }
                    })}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-colors bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm ${
                      errors.subject ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Brief description of your issue"
                  />
                </div>
                {errors.subject && (
                  <p className="text-xs text-red-600">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Category Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiTag className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    {...register('category', { required: 'Please select a category' })}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-colors bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm ${
                      errors.category ? 'border-red-300' : 'border-gray-200'
                    }`}
                    disabled={categoriesLoading}
                  >
                    <option value="">
                      {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                    </option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <p className="text-xs text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Priority Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFlag className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    {...register('priority')}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border transition-colors bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm border-gray-200"
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register('description', { 
                    required: 'Description is required',
                    minLength: { value: 10, message: 'Description must be at least 10 characters' }
                  })}
                  rows="4"
                  className={`w-full px-3 py-2.5 rounded-lg border transition-colors bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm resize-none ${
                    errors.description ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Please provide a detailed description of your issue. Include any error messages, steps to reproduce, and what you expected to happen."
                />
                {errors.description && (
                  <p className="text-xs text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Attachments
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors text-sm ${
                    dragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <FiUpload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-1">
                    Drop files here or{' '}
                    <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                      browse
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        accept={API_CONFIG.ALLOWED_FILE_TYPES.map(type => `.${type}`).join(',')}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">
                    Max {API_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB per file
                  </p>
                </div>

                {/* Attachment List */}
                {attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                        <div className="flex items-center">
                          <FiFile className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {ticketError && errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <FiAlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    <p className="text-sm text-red-700">
                      {errorMessage || 'Failed to create ticket. Please try again.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button - matching Login page styling exactly */}
              <button
                type="submit"
                disabled={!isValid || ticketLoading}
                className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm mt-6"
              >
                {ticketLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating Ticket...
                  </div>
                ) : (
                  'Submit Ticket'
                )}
              </button>
            </form>
          </div>
          
          {/* Footer - matching Login page */}
          <div className="text-center mt-6 text-xs text-gray-500">
            Need immediate assistance? Contact our support team at{' '}
            <a href="mailto:support@quickdesk.com" className="text-blue-600 hover:text-blue-700">
              support@quickdesk.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTicket
