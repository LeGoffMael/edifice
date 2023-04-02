import { MouseEventHandler } from 'react';
import { File } from '../../models/File';
import './FileItem.css';

function FileItem(props: { file: File, index: number, isSelected: boolean, onClick: MouseEventHandler<HTMLDivElement> }) {
    return (
        <div
            key={props.file.path}
            className={`explorer-file-item ${props.isSelected ? 'selected' : ''}`}
            onClick={props.onClick}
        >
            <span>{props.file.name}</span>
        </div>
    );
}
export default FileItem;