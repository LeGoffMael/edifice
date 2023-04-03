import { KeyboardEvent, LegacyRef, MouseEventHandler, useCallback, useEffect, useRef } from 'react';
import { getDataset, updateSelectedFileIndex } from '@/store/dataset'
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { DatasetFile } from '@/types/file';

import '@/components/Explorer.css';

type FileItemProps = {
    refProp: LegacyRef<HTMLDivElement> | undefined
    file: DatasetFile;
    isSelected: boolean;
    onClick: MouseEventHandler<HTMLDivElement>;
};

function FileItem(props: FileItemProps) {
    return (
        <div
            ref={props.refProp}
            className={`explorer-file-item ${props.isSelected && 'selected'}`}
            onClick={props.onClick}
        >
            <span>{props.file.name}</span>
        </div>
    );
}

export default function Explorer() {
    const ref = useRef<HTMLDivElement>(null);
    const selectedFileRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch()
    const dataset = useAppSelector(getDataset)
    const selectedIndex = useAppSelector((state: RootState) => state.selectedDataset.selectedFileIndex)
    const status = useAppSelector((state: RootState) => state.selectedDataset.status)
    const error = useAppSelector((state: RootState) => state.selectedDataset.error)

    const selectFileIndex = (index: number) => {
        dispatch(updateSelectedFileIndex(index))
    }

    // Select previous or next file on arrow key
    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLElement>) => {
            if (selectedIndex === null) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectFileIndex(selectedIndex + 1)
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectFileIndex(selectedIndex - 1)
            }
            selectedFileRef.current?.scrollIntoView({ block: "center" })
        },
        [selectFileIndex]
    );

    const setFocus = useCallback(
        () => ref.current?.focus(),
        [ref]
    );

    let title
    let content
    if (status === 'loading') {
        content = <p className='status'>Loading...</p>
    } else if (status === 'succeeded') {
        title = <div className='explorer-title'>
            <h2>{dataset?.name}</h2>
            <span>{dataset?.files.length} elements</span>
        </div>
        content = dataset?.files.map(((item, index) => (
            <FileItem
                refProp={index === selectedIndex ? selectedFileRef : null}
                key={item.path}
                file={item}
                isSelected={index === selectedIndex}
                onClick={() => selectFileIndex(index)}
            />
        )))
    } else if (status === 'failed') {
        content = <div className='status'>{error}</div>
    }

    return (
        <section className='explorer'>
            {title}
            <div className='explorer-list' ref={ref} tabIndex={-1} onClick={setFocus} onKeyDown={handleKeyDown}>
                {content}
            </div>
        </section>
    );
}