import type { AnyAction, AsyncThunkAction, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dataset } from '@/types/dataset'
import { CommonStateInterface } from '@/types/interfaces'
import { RootState } from '@/app/store'

interface AllDatasetsStateInterface extends CommonStateInterface {
    datasets: Array<Dataset>,
}

const initialState: AllDatasetsStateInterface = {
    datasets: [],
    status: 'idle',
    error: null
}

const allDatasetsSlice = createSlice({
    name: 'allDatasets',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchDatasets.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(fetchDatasets.fulfilled, (state: any, action: PayloadAction<[]>) => {
                state.status = 'succeeded'
                state.datasets = action.payload
            })
            .addCase(fetchDatasets.rejected, (state: any, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export const fetchDatasets = createAsyncThunk('datasets/fetchDatasets', async () => {
    const response = await fetch('/api/datasets');
    return response.json();
})

export default allDatasetsSlice.reducer

export const getAllDatasets = (state: RootState) => state.datasets.datasets
