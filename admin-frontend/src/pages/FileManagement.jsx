import React, { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { adminApi } from '../services/adminApi'
import { formatDate, formatFileSize } from '../utils/helpers'

const FileManagement = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showCleanupModal, setShowCleanupModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: filesData, loading: filesLoading, refetch } = useApi(
    () => adminApi.getFiles({
      page: currentPage,
      limit: 20,
      search: searchTerm
    }),
    [currentPage, searchTerm]
  )

  const { data: storageStats, loading: statsLoading } = useApi(
    adminApi.getStorageStats
  )

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleSelectAll = () => {
    const allFileIds = filesData?.files?.map(file => file._id) || []
    setSelectedFiles(
      selectedFiles.length === allFileIds.length ? [] : allFileIds
    )
  }

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return
    
    setLoading(true)
    try {
      await adminApi.deleteFiles(selectedFiles)
      setSelectedFiles([])
      refetch()
    } catch (err) {
      console.error('Bulk delete failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCleanupOrphans = async () => {
    setLoading(true)
    try {
      await adminApi.cleanupOrphanFiles()
      refetch()
      setShowCleanupModal(false)
    } catch (err) {
      console.error('Cleanup failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const getFileTypeIcon = (mimetype) => {
    if (mimetype?.startsWith('image/')) {
      return (
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    } else if (mimetype?.includes('pdf')) {
      return (
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    } else {
      return (
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  }

  const tableHeaders = [
    { 
      label: (
        <input
          type="checkbox"
          checked={selectedFiles.length === filesData?.files?.length && filesData?.files?.length > 0}
          onChange={handleSelectAll}
          className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
        />
      ),
      field: 'select'
    },
    { label: 'File', field: 'filename' },
    { label: 'Type', field: 'mimetype' },
    { label: 'Size', field: 'size' },
    { label: 'Uploaded By', field: 'uploadedBy' },
    { label: 'Uploaded', field: 'uploadedAt' },
    { label: 'Status', field: 'status' },
    { label: 'Actions', field: 'actions' }
  ]

  const tableData = filesData?.files?.map(file => ({
    ...file,
    select: (
      <input
        type="checkbox"
        checked={selectedFiles.includes(file._id)}
        onChange={() => handleFileSelect(file._id)}
        className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
      />
    ),
    filename: (
      <div className="flex items-center gap-3">
        {getFileTypeIcon(file.mimetype)}
        <div>
          <p className="font-medium text-white">{file.filename}</p>
          <p className="text-sm text-blue-200">{file.originalname}</p>
        </div>
      </div>
    ),
    mimetype: <span className="text-blue-200">{file.mimetype || 'Unknown'}</span>,
    size: <span className="text-white">{formatFileSize(file.size)}</span>,
    uploadedBy: <span className="text-blue-200">{file.uploadedBy?.name || 'System'}</span>,
    uploadedAt: <span className="text-blue-200">{formatDate(file.uploadedAt)}</span>,
    status: (
      <div className={`badge ${file.isOrphan ? 'badge-error' : 'badge-success'}`}>
        {file.isOrphan ? 'Orphan' : 'Active'}
      </div>
    ),
    actions: (
      <div className="flex items-center gap-2">
        <button
          className="btn-secondary text-sm px-3 py-1.5"
          onClick={() => window.open(file.url, '_blank')}
        >
          View
        </button>
        <button
          className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
          onClick={() => handleBulkDelete([file._id])}
        >
          Delete
        </button>
      </div>
    )
  })) || []

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">File Management</h1>
            <p className="page-subtitle">Manage uploaded files and storage</p>
          </div>
          <div className="flex gap-3">
            <button
              className="btn-secondary"
              onClick={() => setShowCleanupModal(true)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Cleanup Orphans
            </button>
            <button
              className="btn-primary"
              disabled={selectedFiles.length === 0}
              onClick={handleBulkDelete}
            >
              {loading ? (
                <div className="loading-spinner w-4 h-4"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Selected ({selectedFiles.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Storage Stats */}
      <div className="stats-grid mb-6">
        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-card-info">
              <div className="stats-label">Total Files</div>
              <div className="stats-number">{storageStats?.totalFiles || 0}</div>
            </div>
            <div className="stats-card-icon bg-gradient-to-br from-primary-500 to-primary-600">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-card-info">
              <div className="stats-label">Storage Used</div>
              <div className="stats-number">{formatFileSize(storageStats?.totalSize) || '0 B'}</div>
            </div>
            <div className="stats-card-icon bg-gradient-to-br from-success-500 to-success-600">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-card-info">
              <div className="stats-label">Orphan Files</div>
              <div className="stats-number">{storageStats?.orphanFiles || 0}</div>
            </div>
            <div className="stats-card-icon bg-gradient-to-br from-error-500 to-error-600">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-card-info">
              <div className="stats-label">Storage Limit</div>
              <div className="stats-number">{formatFileSize(storageStats?.storageLimit) || '10 GB'}</div>
            </div>
            <div className="stats-card-icon bg-gradient-to-br from-purple-500 to-purple-600">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              className="form-input w-full"
              placeholder="Search files..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="glass-card">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white">Files</h3>
          <p className="text-blue-200 mt-1">Total: {filesData?.pagination?.total || 0} files</p>
        </div>
        
        {filesLoading ? (
          <div className="flex justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  {tableHeaders.map((header) => (
                    <th key={header.field} className="px-6 py-4 text-left text-sm font-semibold text-white/90 uppercase tracking-wider">
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {tableData.map((file, index) => (
                  <tr key={file._id || index} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">{file.select}</td>
                    <td className="px-6 py-4">{file.filename}</td>
                    <td className="px-6 py-4">{file.mimetype}</td>
                    <td className="px-6 py-4">{file.size}</td>
                    <td className="px-6 py-4">{file.uploadedBy}</td>
                    <td className="px-6 py-4">{file.uploadedAt}</td>
                    <td className="px-6 py-4">{file.status}</td>
                    <td className="px-6 py-4">{file.actions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!tableData || tableData.length === 0) && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-white/60">No files found</p>
              </div>
            )}
          </div>
        )}
        
        {filesData?.pagination && filesData.pagination.pages > 1 && (
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-200">
                Page {currentPage} of {filesData.pagination.pages}
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-secondary px-3 py-2 text-sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className="btn-secondary px-3 py-2 text-sm"
                  onClick={() => setCurrentPage(prev => Math.min(filesData.pagination.pages, prev + 1))}
                  disabled={currentPage === filesData.pagination.pages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cleanup Modal */}
      {showCleanupModal && (
        <div className="modal-overlay" onClick={() => setShowCleanupModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Cleanup Orphan Files</h2>
              <button
                className="text-white/60 hover:text-white transition-colors"
                onClick={() => setShowCleanupModal(false)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-white/90">
                This will permanently delete all orphan files (files that are no longer referenced by any tickets).
              </p>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white/80">
                  Found <span className="font-semibold text-red-400">{storageStats?.orphanFiles || 0}</span> orphan files taking up{' '}
                  <span className="font-semibold text-red-400">{formatFileSize(storageStats?.orphanSize) || '0 B'}</span> of storage.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button className="btn-secondary" onClick={() => setShowCleanupModal(false)}>
                  Cancel
                </button>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  onClick={handleCleanupOrphans}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="loading-spinner w-4 h-4"></div>
                      Processing...
                    </div>
                  ) : (
                    'Delete Orphan Files'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileManagement
