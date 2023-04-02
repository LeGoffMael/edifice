import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { File } from '../models/File'
import { CommonStateInterface } from '../models/CommonStateInterface'
import { RootState } from '../app/store'

interface AllFilesStateInterface extends CommonStateInterface {
    files: Array<File>,
    selectedFile: File | null,
}

const initialState: AllFilesStateInterface = {
    files: [],
    selectedFile: null,
    status: 'idle',
    error: null
}

const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        updateSelectedFile: (state: any, action: PayloadAction<File>) => {
            state.selectedFile = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchFiles.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(fetchFiles.fulfilled, (state: any, action: PayloadAction<[]>) => {
                state.status = 'succeeded'
                state.files = action.payload
                state.selectedFile = state.files[0]
            })
            .addCase(fetchFiles.rejected, (state: any, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export const fetchFiles = createAsyncThunk('files/fetchFiles', async () => {
    const response = await fetch('/api/files?' + new URLSearchParams({
        path: '/Users/mlegoff/Workspace',
        extensions: '.png,.jpg,.jpeg,.gif',
        recursive: 'true',
    }));
    return response.json();
})

export const { updateSelectedFile } = filesSlice.actions

export default filesSlice.reducer

export const getAllFiles = (state: RootState) => state.files.files