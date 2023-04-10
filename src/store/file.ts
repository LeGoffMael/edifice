import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { DatasetFile, DatasetFileInfo } from '@/types/file'
import { CommonStateInterface, CommonStateStatus } from '@/types/interfaces'
import { AppDispatch, RootState } from '@/app/store'
import { updateSelectedFileIndex } from '@/store/dataset'

export type SelectedFileParam = {
    datasetId: string, fileNoInfo: DatasetFile
}

interface FileStateInterface extends CommonStateInterface {
    file: DatasetFile | null,
    datasetId: string | null,
}

const initialState: FileStateInterface = {
    file: null,
    datasetId: null,
    status: CommonStateStatus.idle
}

const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        updateSelectedFilePath: (state: any, action: PayloadAction<SelectedFileParam>) => {
            state.datasetId = action.payload.datasetId;
            state.file = action.payload.fileNoInfo;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchFileInfo.pending, (state: any) => {
                state.status = CommonStateStatus.loading
            })
            .addCase(fetchFileInfo.fulfilled, (state: any, action: PayloadAction<DatasetFileInfo>) => {
                state.file.info = action.payload
                state.status = CommonStateStatus.succeeded
            })
            .addCase(fetchFileInfo.rejected, (state: any, action) => {
                state.status = CommonStateStatus.failed(action.error.message)
            })
    }
})

export const fetchFileInfo = createAsyncThunk('file/fetchFileInfo', async (fileIndex: number, { getState, dispatch }) => {
    const datasetId = (getState() as RootState).selectedDataset.dataset?.id;
    if (datasetId == null) { console.error('Error selected datasetId is null.'); return null; }
    const file = (getState() as RootState).selectedDataset.dataset?.files.at(fileIndex);
    if (file == null || file.path == null) { console.error(`File data at [${fileIndex}] index is incorrect.`); return null; }

    (dispatch as AppDispatch)(updateSelectedFileIndex(fileIndex));
    (dispatch as AppDispatch)(updateSelectedFilePath({ datasetId: datasetId, fileNoInfo: file }));

    const response = await fetch(`/api/datasets/${datasetId}/file_info?path=${file.path}`);
    return response.json();
})

export const { updateSelectedFilePath } = fileSlice.actions

export default fileSlice.reducer

export const getSelectedFile = (state: RootState) => state.selectedFile.file
export const getSelectedFileStatus = (state: RootState) => CommonStateStatus.fromInterface(state.selectedFile.status)
