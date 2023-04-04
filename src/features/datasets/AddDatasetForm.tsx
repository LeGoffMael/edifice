import { useAppDispatch } from '@/app/hooks';
import DatasetForm from '@/features/datasets/DatasetForm';
import { postDataset } from '@/store/allDatasets';
import { Dataset } from '@/types/dataset';

export default function AddDatasetForm() {
    const dispatch = useAppDispatch()

    const onSaveDatasetClicked = (dataset: Dataset) => {
        dispatch(postDataset(dataset));
    }

    return (
        <DatasetForm
            title="New Dataset"
            submitButton="Create new dataset"
            onSubmit={onSaveDatasetClicked}
        />
    )
}