import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import categoryService from '../../services/categoryService'

const initialState = {
  categories: [],
  category: null,
  stats: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  pagination: null
}

// Get all categories
export const getCategories = createAsyncThunk(
  'categories/getAll',
  async (params, thunkAPI) => {
    try {
      return await categoryService.getCategories(params)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get category by ID
export const getCategory = createAsyncThunk(
  'categories/getById',
  async (id, thunkAPI) => {
    try {
      return await categoryService.getCategory(id)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create new category
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, thunkAPI) => {
    try {
      return await categoryService.createCategory(categoryData)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update category
export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, categoryData }, thunkAPI) => {
    try {
      return await categoryService.updateCategory(id, categoryData)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete category
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, thunkAPI) => {
    try {
      return await categoryService.deleteCategory(id)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get category statistics
export const getCategoryStats = createAsyncThunk(
  'categories/getStats',
  async (_, thunkAPI) => {
    try {
      return await categoryService.getCategoryStats()
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    clearCategory: (state) => {
      state.category = null
    },
    clearCategories: (state) => {
      state.categories = []
      state.pagination = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Get categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.categories = action.payload.data.categories
        state.pagination = action.payload.data.pagination
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get category
      .addCase(getCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.category = action.payload.data.category
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.categories.unshift(action.payload.data.category)
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.category = action.payload.data.category
        const index = state.categories.findIndex(
          (category) => category._id === action.payload.data.category._id
        )
        if (index !== -1) {
          state.categories[index] = action.payload.data.category
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.categories = state.categories.filter(
          (category) => category._id !== action.meta.arg
        )
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get stats
      .addCase(getCategoryStats.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCategoryStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.stats = action.payload.data
      })
      .addCase(getCategoryStats.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset, clearCategory, clearCategories } = categorySlice.actions
export default categorySlice.reducer
