import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../../services/userService'

const initialState = {
  users: [],
  user: null,
  agents: [],
  stats: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  pagination: null
}

// Get all users (Admin only)
export const getUsers = createAsyncThunk(
  'users/getAll',
  async (params, thunkAPI) => {
    try {
      return await userService.getUsers(params)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user by ID
export const getUser = createAsyncThunk(
  'users/getById',
  async (id, thunkAPI) => {
    try {
      return await userService.getUser(id)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create new user (Admin only)
export const createUser = createAsyncThunk(
  'users/create',
  async (userData, thunkAPI) => {
    try {
      return await userService.createUser(userData)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update user (Admin only)
export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, userData }, thunkAPI) => {
    try {
      return await userService.updateUser(id, userData)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete user (Admin only)
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, thunkAPI) => {
    try {
      return await userService.deleteUser(id)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get agents for ticket assignment
export const getAgents = createAsyncThunk(
  'users/getAgents',
  async (_, thunkAPI) => {
    try {
      return await userService.getAgents()
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user statistics (Admin only)
export const getUserStats = createAsyncThunk(
  'users/getStats',
  async (_, thunkAPI) => {
    try {
      return await userService.getUserStats()
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    clearUser: (state) => {
      state.user = null
    },
    clearUsers: (state) => {
      state.users = []
      state.pagination = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Get users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = action.payload.data.users
        state.pagination = action.payload.data.pagination
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get user
      .addCase(getUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload.data.user
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users.unshift(action.payload.data.user)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload.data.user
        const index = state.users.findIndex(
          (user) => user._id === action.payload.data.user._id
        )
        if (index !== -1) {
          state.users[index] = action.payload.data.user
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = state.users.filter(
          (user) => user._id !== action.meta.arg
        )
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get agents
      .addCase(getAgents.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAgents.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.agents = action.payload.data.agents
      })
      .addCase(getAgents.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get stats
      .addCase(getUserStats.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.stats = action.payload.data
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset, clearUser, clearUsers } = userSlice.actions
export default userSlice.reducer
