import React from 'react'
import CreateTicket from '../pages/CreateTicket'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../redux/slices/authSlice'
import ticketSlice from '../redux/slices/ticketSlice'
import categorySlice from '../redux/slices/categorySlice'
import { mockCategories } from '../data/mockCategories'

// Mock store with demo data
const mockStore = configureStore({
  reducer: {
    auth: authSlice,
    tickets: ticketSlice,
    categories: categorySlice,
  },
  preloadedState: {
    auth: {
      user: {
        _id: 'demo-user',
        name: 'Demo User',
        email: 'demo@quickdesk.com',
        role: 'user'
      },
      token: 'demo-token',
      isLoading: false,
      isSuccess: false,
      isError: false,
      message: ''
    },
    categories: {
      categories: mockCategories,
      category: null,
      stats: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      message: '',
      pagination: null
    },
    tickets: {
      tickets: [],
      ticket: null,
      stats: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      message: '',
      pagination: null
    }
  }
})

const CreateTicketDemo = () => {
  return (
    <Provider store={mockStore}>
      <div>
        {/* Demo Banner */}
        <div className="bg-blue-600 text-white text-center py-2 text-sm">
          🚀 Demo Mode - Create Ticket Form Preview
        </div>
        <CreateTicket />
      </div>
    </Provider>
  )
}

export default CreateTicketDemo
