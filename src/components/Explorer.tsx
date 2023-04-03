import { MouseEventHandler } from 'react';
import { getDatasetFiles, updateSelectedFile } from '@/store/dataset'
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { DatasetFile } from '@/types/file';

import '@/components/Explorer.css';

type FileItemProps = {
    file: DatasetFile;
    isSelected: boolean;
    onClick: MouseEventHandler<HTMLDivElement>;
};

function FileItem(props: FileItemProps) {
    return (
        <div
            className={`explorer-file-item ${props.isSelected ? 'selected' : ''}`}
            onClick={props.onClick}
        >
            <span>{props.file.name}</span>
        </div>
    );
}

export default function Explorer() {
    const dispatch = useAppDispatch()
    const files = useAppSelector(getDatasetFiles)
    const selectedFile = useAppSelector((state: RootState) => state.selectedDataset.selectedFile)
    const status = useAppSelector((state: RootState) => state.selectedDataset.status)
    const error = useAppSelector((state: RootState) => state.selectedDataset.error)

    const selectFile = (file: DatasetFile) => {
        dispatch(updateSelectedFile(file))
    }

    let content

    if (status === 'loading') {
        content = <p className='status'>Loading...</p>
    } else if (status === 'succeeded') {
        content = files.map(((item) => (
            <FileItem
                key={item.path}
                file={item}
                isSelected={item.path === selectedFile?.path}
                onClick={() => selectFile(item)}
            />
        )))
    } else if (status === 'failed') {
        content = <div className='status'>{error}</div>
    }

    return (
        <section className='explorer'>
            <div className='explorer-title'>
                <h2>Explorer</h2>
                <span>{files.length} elements</span>
            </div>
            <div className='explorer-list'>
                {content}
            </div>
        </section>
    );
}