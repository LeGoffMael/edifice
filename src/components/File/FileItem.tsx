import { File } from '../../models/file';
import './FileItem.css';

function FileItem(props: { file: File, index: number }) {
    return (
        <div
            key={props.file.path}
            className='explorer-file-item'>
            <span>{props.file.name}</span>
        </div>
    );
}
export default FileItem;