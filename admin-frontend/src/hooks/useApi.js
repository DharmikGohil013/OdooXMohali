import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'

/**
 * Custom hook for API calls with loading, error, and success states
 */
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction(...args)
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, dependencies)

  return { data, loading, error, execute, setData }
}

/**
 * Custom hook for paginated data
 */
export const usePaginatedApi = (apiFunction, initialParams = {}) => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [params, setParams] = useState({ page: 1, limit: 20, ...initialParams })

  const fetchData = useCallback(async (newParams = {}) => {
    try {
      setLoading(true)
      setError(null)
      const finalParams = { ...params, ...newParams }
      const result = await apiFunction(finalParams)
      
      if (result.success) {
        setData(result.data?.items || result.data || [])
        setPagination(result.data?.pagination || null)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [apiFunction, params])

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }, [])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [params])

  return {
    data,
    pagination,
    loading,
    error,
    params,
    updateParams,
    refresh,
    setData
  }
}

/**
 * Custom hook for real-time data with polling
 */
export const usePolling = (apiFunction, interval = 30000, dependencies = []) => {
  const { data, loading, error, execute } = useApi(apiFunction, dependencies)
  const [isPolling, setIsPolling] = useState(false)

  const startPolling = useCallback(() => {
    setIsPolling(true)
  }, [])

  const stopPolling = useCallback(() => {
    setIsPolling(false)
  }, [])

  useEffect(() => {
    if (isPolling) {
      execute()
      const intervalId = setInterval(execute, interval)
      return () => clearInterval(intervalId)
    }
  }, [isPolling, execute, interval])

  return {
    data,
    loading,
    error,
    startPolling,
    stopPolling,
    isPolling,
    refresh: execute
  }
}

/**
 * Custom hook for form handling with API integration
 */
export const useApiForm = (apiFunction, onSuccess, onError) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = useCallback(async (formData) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction(formData)
      
      if (result.success) {
        toast.success(result.message || 'Operation completed successfully')
        if (onSuccess) onSuccess(result)
      }
      
      return result
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      if (onError) onError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunction, onSuccess, onError])

  return { submit, loading, error }
}

/**
 * Custom hook for managing modal state
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)
  const [data, setData] = useState(null)

  const open = useCallback((modalData = null) => {
    setData(modalData)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return {
    isOpen,
    data,
    open,
    close,
    toggle
  }
}

/**
 * Custom hook for search functionality
 */
export const useSearch = (searchFunction, debounceMs = 300) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await searchFunction(searchQuery)
      setResults(result.data || [])
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Search failed'
      setError(errorMessage)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [searchFunction])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(query)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [query, search, debounceMs])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearResults: () => setResults([])
  }
}

/**
 * Custom hook for local storage
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}
