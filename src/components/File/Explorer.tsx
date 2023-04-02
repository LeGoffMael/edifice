import { useEffect } from 'react';
import { getAllFiles, fetchFiles, updateSelectedFile } from '../../store/files'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';

import FileItem from './FileItem';
import './Explorer.css';
import { File } from '../../models/File';

export default function Explorer() {
    const dispatch = useAppDispatch()
    const files = useAppSelector(getAllFiles)
    const selectedFile = useAppSelector((state: RootState) => state.files.selectedFile)
    const status = useAppSelector((state: RootState) => state.files.status)
    const error = useAppSelector((state: RootState) => state.files.error)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchFiles())
        }
    }, [status, dispatch])

    const selectFile = (file: File) => {
        dispatch(updateSelectedFile(file))
    }

    let content

    if (status === 'loading') {
        content = <p className='status'>Loading...</p>
    } else if (status === 'succeeded') {
        content = files.map(((item, index) => (
            <FileItem
                key={item.path}
                file={item}
                index={index}
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