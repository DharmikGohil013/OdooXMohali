import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ticketService from '../../services/ticketService'

const initialState = {
  tickets: [],
  ticket: null,
  stats: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  pagination: null
}

// Get all tickets
export const getTickets = createAsyncThunk(
  'tickets/getAll',
  async (params, thunkAPI) => {
    try {
      return await ticketService.getTickets(params)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get ticket by ID
export const getTicket = createAsyncThunk(
  'tickets/getById',
  async (id, thunkAPI) => {
    try {
      return await ticketService.getTicket(id)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create new ticket
export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, thunkAPI) => {
    try {
      return await ticketService.createTicket(ticketData)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update ticket
export const updateTicket = createAsyncThunk(
  'tickets/update',
  async ({ id, ticketData }, thunkAPI) => {
    try {
      return await ticketService.updateTicket(id, ticketData)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete ticket
export const deleteTicket = createAsyncThunk(
  'tickets/delete',
  async (id, thunkAPI) => {
    try {
      return await ticketService.deleteTicket(id)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Add comment to ticket
export const addComment = createAsyncThunk(
  'tickets/addComment',
  async ({ id, commentData }, thunkAPI) => {
    try {
      return await ticketService.addComment(id, commentData)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Rate ticket
export const rateTicket = createAsyncThunk(
  'tickets/rate',
  async ({ id, ratingData }, thunkAPI) => {
    try {
      return await ticketService.rateTicket(id, ratingData)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get ticket statistics
export const getTicketStats = createAsyncThunk(
  'tickets/getStats',
  async (params, thunkAPI) => {
    try {
      return await ticketService.getTicketStats(params)
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    clearTicket: (state) => {
      state.ticket = null
    },
    clearTickets: (state) => {
      state.tickets = []
      state.pagination = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Get tickets
      .addCase(getTickets.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tickets = action.payload.data.tickets
        state.pagination = action.payload.data.pagination
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get ticket
      .addCase(getTicket.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.ticket = action.payload.data.ticket
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Create ticket
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tickets.unshift(action.payload.data.ticket)
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Update ticket
      .addCase(updateTicket.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.ticket = action.payload.data.ticket
        const index = state.tickets.findIndex(
          (ticket) => ticket._id === action.payload.data.ticket._id
        )
        if (index !== -1) {
          state.tickets[index] = action.payload.data.ticket
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Delete ticket
      .addCase(deleteTicket.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tickets = state.tickets.filter(
          (ticket) => ticket._id !== action.meta.arg
        )
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        if (state.ticket) {
          state.ticket.comments.push(action.payload.data.comment)
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Rate ticket
      .addCase(rateTicket.pending, (state) => {
        state.isLoading = true
      })
      .addCase(rateTicket.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        if (state.ticket) {
          state.ticket.satisfactionRating = action.payload.data.rating
        }
      })
      .addCase(rateTicket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get stats
      .addCase(getTicketStats.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTicketStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.stats = action.payload.data
      })
      .addCase(getTicketStats.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset, clearTicket, clearTickets } = ticketSlice.actions
export default ticketSlice.reducer
