import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dataset } from '@/types/dataset'
import { CommonStateInterface, CommonStateStatus } from '@/types/interfaces'
import { AppDispatch, RootState } from '@/app/store'
import { DatasetFileCustomTag, DatasetFileTag } from '@/types/file'

interface DatasetsEvaluateStatus {
  current: number,
  total: number,
  status: string,
}

export interface DatasetsSaveCustomTags {
  datasetId: string,
  add: Array<DatasetFileCustomTag>,
  edit: Array<DatasetFileCustomTag>,
  remove: Array<string>,
}

export interface DatasetsSaveTagMatching {
  datasetId: string,
  tag: DatasetFileTag,
  matchPos: number | null,
  matchId: string | null,
}

interface DatasetsStateInterface extends CommonStateInterface {
  dataset: Dataset | null,
  selectedFileIndex: number | null,
  evaluateStatus: DatasetsEvaluateStatus | null,
}

const initialState: DatasetsStateInterface = {
  dataset: null,
  selectedFileIndex: null,
  evaluateStatus: null,
  status: CommonStateStatus.idle
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
        state.status = CommonStateStatus.loading
      })
      .addCase(fetchDataset.fulfilled, (state: any, action: PayloadAction<[]>) => {
        state.status = CommonStateStatus.succeeded
        state.dataset = action.payload
        if (state.dataset.files.length > 0) {
          state.selectedFileIndex = 0
        }
      })
      .addCase(fetchDataset.rejected, (state: any, action) => {
        state.status = CommonStateStatus.failed(action.error.message)
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
      .addCase(evaluateDatasetStatus.fulfilled, (state: any, action: PayloadAction<DatasetsEvaluateStatus>) => {
        state.evaluateStatus = action.payload
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

export const saveDatasetCustomTags = createAsyncThunk('datasets/saveDatasetCustomTags', async (data: DatasetsSaveCustomTags) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  const response = await fetch(`/api/datasets/${data.datasetId}/customTags`, requestOptions);
  return response.json();
})

export const saveDatasetTagMatching = createAsyncThunk('datasets/saveDataseTagMatching', async (data: DatasetsSaveTagMatching) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  const response = await fetch(`/api/datasets/${data.datasetId}/tagMatching/${data.matchPos}`, requestOptions);
  return response.json();
})

export const clearDatasetTagMatching = createAsyncThunk('datasets/clearDataseTagMatching', async (data: Omit<DatasetsSaveTagMatching, 'matchPos' | 'matchId'>) => {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  const response = await fetch(`/api/datasets/${data.datasetId}/tagMatching`, requestOptions);
  return response.json();
})

export const evaluateDataset = createAsyncThunk('dataset/evaluateDataset', async (dataset: Dataset, { dispatch }) => {
  const response = await fetch(`/api/datasets/${dataset.id}/evaluate`, { method: 'POST' })
  const data = await response.json();

  if (data.statusUrl !== null) {
    (dispatch as AppDispatch)(evaluateDatasetStatus(data.statusUrl));
  }
})

const evaluateDatasetStatus = createAsyncThunk('dataset/evaluateDatasetStatus', async (statusUrl: string, { dispatch }) => {
  const response = await fetch(statusUrl);
  const data = await response.json();

  if (data['state'] === 'PENDING' || data['state'] === 'PROGRESS') {
    // rerun in 1 seconds
    setTimeout(function () {
      (dispatch as AppDispatch)(evaluateDatasetStatus(statusUrl));
    }, 1000);
  }

  return data;
})

export const { updateSelectedFileIndex } = datasetSlice.actions

export default datasetSlice.reducer

export const getDataset = (state: RootState) => state.selectedDataset.dataset
export const getDatasetEvaluateStatus = (state: RootState) => state.selectedDataset.evaluateStatus
export const getDatasetStatus = (state: RootState) => CommonStateStatus.fromInterface(state.selectedDataset.status)
