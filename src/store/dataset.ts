import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dataset } from '@/types/dataset'
import { CommonStateInterface } from '@/types/interfaces'
import { RootState } from '@/app/store'

interface DatasetsStateInterface extends CommonStateInterface {
  dataset: Dataset | null,
  selectedFileIndex: number | null,
}

const initialState: DatasetsStateInterface = {
  dataset: null,
  selectedFileIndex: null,
  status: 'idle',
  error: null
}

const datasetSlice = createSlice({
  name: 'dataset',
  initialState,
  reducers: {
    updateSelectedFileIndex: (state: any, action: PayloadAction<number>) => {
      const index = action.payload
      if (index < 0 || index > state.dataset.files.length - 1) return
      state.selectedFileIndex = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDataset.pending, (state: any) => {
        state.status = 'loading'
      })
      .addCase(fetchDataset.fulfilled, (state: any, action: PayloadAction<[]>) => {
        state.status = 'succeeded'
        state.dataset = action.payload
        if (state.dataset.files.length > 0) {
          state.selectedFileIndex = 0
        }
      })
      .addCase(fetchDataset.rejected, (state: any, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const fetchDataset = createAsyncThunk('datasets/fetchDatasetById', async (dataset: Dataset) => {
  const response = await fetch(`/api/dataset/${dataset.id}`);
  return response.json();
})

export const { updateSelectedFileIndex } = datasetSlice.actions

export default datasetSlice.reducer

export const getDataset = (state: RootState) => state.selectedDataset.dataset
export const getSelectedFile = (state: RootState) =>
  state.selectedDataset.selectedFileIndex === null
    ? null
    : state.selectedDataset.dataset?.files[state.selectedDataset.selectedFileIndex] ?? null