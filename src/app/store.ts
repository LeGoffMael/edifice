import { configureStore } from '@reduxjs/toolkit'
import allDatasetsReducer from '@/store/allDatasets'
import dataset from '@/store/dataset'
import file from '@/store/file'

export const store = configureStore({
    reducer: {
        datasets: allDatasetsReducer,
        selectedDataset: dataset,
        selectedFile: file,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch