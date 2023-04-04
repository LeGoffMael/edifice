import { useAppDispatch } from '@/app/hooks';
import DatasetForm from '@/features/datasets/DatasetForm';
import { Dataset } from '@/types/dataset';

export default function AddDatasetForm() {
    const dispatch = useAppDispatch()

    const onSaveDatasetClicked = (dataset: Dataset) => {
        console.log('save', dataset);
    }

    return (
        <DatasetForm
            title="New Dataset"
            submitButton="Create new dataset"
            onSubmit={onSaveDatasetClicked}
        />
    )
}