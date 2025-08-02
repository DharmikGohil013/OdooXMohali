import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import ticketReducer from './slices/ticketSlice'
import categoryReducer from './slices/categorySlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    categories: categoryReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

// Export store for usage in components
export default store
