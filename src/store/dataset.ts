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
      .addCase(editDataset.fulfilled, (state: any, action: PayloadAction<Dataset>) => {
        const editedDataset: Dataset = action.payload
        // if is selected dataset, replace it
        if (state.dataset?.id === editedDataset.id) {
          state.dataset = editedDataset;
          // TODO: reload files after edit
        }
      })
      .addCase(deleteDataset.fulfilled, (state: any, action: PayloadAction<{}>) => {
        const deletedId = action.payload as string
        // if is selected dataset, replace it by initial
        if (state.dataset?.id === deletedId) {
          state.dataset = null;
          state.selectedFileIndex = null;
        }
      })
  }
})

export const fetchDataset = createAsyncThunk('dataset/fetchDatasetById', async (dataset: Dataset) => {
  const response = await fetch(`/api/datasets/${dataset.id}`);
  return response.json();
})

export const editDataset = createAsyncThunk('dataset/editDataset', async (dataset: Dataset) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataset)
  };
  const response = await fetch(`/api/datasets/${dataset.id}`, requestOptions);
  return response.json();
})

export const deleteDataset = createAsyncThunk('dataset/deleteDataset', async (id: string) => {
  const response = await fetch(`/api/datasets/${id}`, { method: 'DELETE' });
  return response.text();
})

export const { updateSelectedFileIndex } = datasetSlice.actions

export default datasetSlice.reducer

export const getDataset = (state: RootState) => state.selectedDataset.dataset
export const getSelectedFile = (state: RootState) =>
  state.selectedDataset.selectedFileIndex === null
    ? null
    : state.selectedDataset.dataset?.files[state.selectedDataset.selectedFileIndex] ?? null