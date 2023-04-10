import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dataset } from '@/types/dataset'
import { CommonStateInterface, CommonStateStatus } from '@/types/interfaces'
import { RootState } from '@/app/store'
import { deleteDataset, editDataset } from './dataset'

interface AllDatasetsStateInterface extends CommonStateInterface {
    datasets: Array<Dataset>,
}

const initialState: AllDatasetsStateInterface = {
    datasets: [],
    status: CommonStateStatus.idle
}

const allDatasetsSlice = createSlice({
    name: 'allDatasets',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // get all dataset
            .addCase(fetchDatasets.pending, (state: any) => {
                state.status = CommonStateStatus.loading
            })
            .addCase(fetchDatasets.fulfilled, (state: any, action: PayloadAction<[]>) => {
                state.status = CommonStateStatus.succeeded
                state.datasets = action.payload
            })
            .addCase(fetchDatasets.rejected, (state: any, action) => {
                state.status = CommonStateStatus.failed(action.error.message)
            })
            // add dataset
            .addCase(postDataset.fulfilled, (state: any, action: PayloadAction<[]>) => {
                state.datasets.push(action.payload)
            })
            .addCase(postDataset.rejected, (state: any, action) => {
                // TODO handle error
                console.error(postDataset.name, action.error.message)
            })
            .addCase(editDataset.fulfilled, (state: any, action: PayloadAction<Dataset>) => {
                const editedDataset: Dataset = action.payload
                // if dataset in list replace it
                const index = state.datasets?.findIndex((d: Dataset) => d.id === editedDataset.id);
                if (index !== -1) {
                    state.datasets[index] = editedDataset;
                }
            })
            .addCase(deleteDataset.fulfilled, (state: any, action: PayloadAction<{}>) => {
                const deletedId = action.payload
                // if dataset in list delete it
                const index = state.datasets?.findIndex((d: Dataset) => d.id === deletedId);
                if (index !== -1) {
                    state.datasets.splice(index, 1);
                }
            })
    }
})

export const fetchDatasets = createAsyncThunk('datasets/fetchDatasets', async () => {
    const response = await fetch('/api/datasets');
    return response.json();
})

export const postDataset = createAsyncThunk('datasets/postDataset', async (dataset: Dataset) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataset)
    };
    const response = await fetch('/api/datasets/add', requestOptions);
    return response.json();
})

export default allDatasetsSlice.reducer

export const getAllDatasets = (state: RootState) => state.datasets.datasets
export const getAllDatasetsStatus = (state: RootState) => CommonStateStatus.fromInterface(state.datasets.status)
export const getDatasetById = (state: RootState, id: string) => state.datasets.datasets.find(d => d.id === id);
