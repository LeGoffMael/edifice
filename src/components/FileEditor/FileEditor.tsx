import { useAppSelector } from '@/app/hooks';
import CropImage from '@/components/FileEditor/Viewer/CropImage';
import PromptEditor from '@/components/FileEditor/Prompt/PromptEditor';
import '@/components/FileEditor/FileEditor.css';
import { getSelectedFile, getSelectedFileStatus } from '@/store/file';
import { getDataset, getDatasetStatus } from '@/store/dataset';

export default function FileEditor() {
    const dataset = useAppSelector(getDataset)
    const datasetStatus = useAppSelector(getDatasetStatus)
    const selectedFile = useAppSelector(getSelectedFile)
    const selectedFileInfoStatus = useAppSelector(getSelectedFileStatus)

    function isImage(path: string) {
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(path);
    }

    if (datasetStatus.isLoading()) {
        return <div className='file-editor-status'>Loading...</div>
    } else if (datasetStatus.isSucceeded()) {
        if (selectedFile === null || selectedFile === undefined) {
            return <p className='file-editor-status'>No file selected.</p>
        }

        if (selectedFileInfoStatus.isFailed()) {
            return <p className='file-editor-status'>{selectedFileInfoStatus.error}</p>
        }

        return (
            <section className='file-editor'>
                <div className='file-editor-title'>
                    <h3>{selectedFile.path}</h3>
                </div>
                <div className='file-editor-content'>
                    {isImage(selectedFile.path)
                        ? <CropImage imagePath={selectedFile.path} canCrop={dataset?.idealSize !== undefined} />
                        : <span>File format not supported</span>}
                    <PromptEditor isLoading={selectedFileInfoStatus.isLoading()} selectedFile={selectedFile} />
                </div>
            </section>
        )
    }

    return <div className='file-editor-status'>{datasetStatus.error}</div>
}