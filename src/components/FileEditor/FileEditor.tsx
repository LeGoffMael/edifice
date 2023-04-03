import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import CropImage from '@/components/FileEditor/Viewer/CropImage';
import PromptEditor from '@/components/FileEditor/Prompt/PromptEditor';
import '@/components/FileEditor/FileEditor.css';
import { getDataset, getSelectedFile } from '@/store/dataset';

export default function FileEditor() {
    const dataset = useAppSelector(getDataset)
    const selectedFile = useAppSelector(getSelectedFile)
    const status = useAppSelector((state: RootState) => state.selectedDataset.status)
    const error = useAppSelector((state: RootState) => state.selectedDataset.error)

    if (status === 'loading') {
        return <div className='file-editor-status'>Loading...</div>
    } else if (status === 'succeeded') {
        if (selectedFile === null) {
            return <p className='file-editor-status'>No file selected.</p>
        }
        return (
            <section className='file-editor'>
                <div className='file-editor-title'>
                    <h3>{selectedFile?.path}</h3>
                </div>
                <div className='file-editor-content'>
                    <CropImage imagePath={selectedFile.path} canCrop={dataset?.idealSize !== undefined} />
                    <PromptEditor />
                </div>
            </section>
        )
    }

    return <div className='file-editor-status'>{error}</div>
}