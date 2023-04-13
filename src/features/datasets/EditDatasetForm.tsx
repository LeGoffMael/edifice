import { useAppDispatch } from '@/app/hooks';
import DatasetForm from '@/features/datasets/DatasetForm';
import { editDataset } from '@/store/dataset';
import { Dataset } from '@/types/dataset';
import { useLoaderData } from 'react-router-dom';

export default function EditDatasetForm() {
    const dataset = useLoaderData() as Dataset;
    const dispatch = useAppDispatch()

    const onSaveDatasetClicked = (dataset: Dataset) => {
        dispatch(editDataset(dataset));
    }

    return (
        <DatasetForm
            dataset={dataset}
            title={`Edit <${dataset.name}>`}
            submitButton="Save dataset"
            onSubmit={onSaveDatasetClicked}
        />
    )
}