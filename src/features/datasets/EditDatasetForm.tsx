import { useAppDispatch } from '@/app/hooks';
import { RootState } from '@/app/store';
import DatasetForm from '@/features/datasets/DatasetForm';
import { getDatasetById } from '@/store/allDatasets';
import { Dataset } from '@/types/dataset';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

export async function datasetLoader({ params }: LoaderFunctionArgs, state: RootState) {
    const dataset = getDatasetById(state, params.datasetId!);
    if (!dataset) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        });
    }
    return dataset;
}

export default function EditDatasetForm() {
    const dataset = useLoaderData() as Dataset;
    const dispatch = useAppDispatch()

    const onSaveDatasetClicked = (dataset: Dataset) => {
        console.log('edit', dataset);
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