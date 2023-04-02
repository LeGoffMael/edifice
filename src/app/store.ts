import { configureStore } from '@reduxjs/toolkit'
import filesReducer from '../store/files'

export const store = configureStore({
    reducer: {
        files: filesReducer,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch