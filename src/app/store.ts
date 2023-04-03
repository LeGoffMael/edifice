import { configureStore } from '@reduxjs/toolkit'
import allDatasetsReducer from '@/store/allDatasets'
import dataset from '@/store/dataset'

export const store = configureStore({
    reducer: {
        datasets: allDatasetsReducer,
        selectedDataset: dataset,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch