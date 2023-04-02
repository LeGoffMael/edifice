import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import CropImage from './Viewer/CropImage';
import PromptEditor from './Prompt/PromptEditor';
import './FileEditor.css';

export default function FileEditor() {
    const selectedFile = useAppSelector((state: RootState) => state.files.selectedFile)
    const status = useAppSelector((state: RootState) => state.files.status)
    const error = useAppSelector((state: RootState) => state.files.error)

    if (status === 'loading') {
        return <div className='file-editor-status'>Loading...</div>
    } else if (status === 'succeeded') {
        if (selectedFile === null) {
            return <p className='file-editor-status'>No file selected.</p>
        }
        return (
            <div className='file-editor'>
                <CropImage imagePath={selectedFile.path} />
                <PromptEditor />
            </div>
        )
    }

    return <div className='file-editor-status'>{error}</div>
}