import { useState } from 'react'
import Modal from '@/components/Modal';
import { Dataset } from '@/types/dataset'

import '@/features/datasets/DatasetForm.css';

type Props = {
    title: string;
    submitButton: string;
    dataset?: Dataset;
    onSubmit(dataset: Dataset): void;
};

export default function DatasetForm(props: Props) {
    const [dataset, setDataset] = useState<Dataset>(props.dataset ?? new Dataset())

    const onDatasetChanged = (val: Partial<Dataset>) => setDataset({ ...dataset, ...val })

    return (
        <Modal>
            <section className='dataset-form'>
                <h2>{props.title}</h2>
                <form>
                    <label htmlFor="datasetName">Dataset Name:</label>
                    <input
                        id="datasetName"
                        name="datasetName"
                        type="text"
                        value={dataset.name}
                        onChange={((e) => onDatasetChanged({ name: e.target.value }))}
                    />
                    <label htmlFor="datasetPath">Path:</label>
                    <input
                        id="datasetPath"
                        name="datasetPath"
                        type="text"
                        value={dataset.path}
                        onChange={((e) => onDatasetChanged({ path: e.target.value }))}
                    />
                    <label htmlFor="datasetExtensions">Include extensions regex:</label>
                    <input
                        id="datasetExtensions"
                        name="datasetExtensions"
                        type="text"
                        value={dataset.includeExtRegex}
                        onChange={((e) => onDatasetChanged({ includeExtRegex: e.target.value }))}
                    />
                    <label htmlFor="datasetExcludeDir">Exclude directories regex:</label>
                    <input
                        id="datasetExcludeDir"
                        name="datasetExcludeDir"
                        type="text"
                        value={dataset.excludeDirRegex}
                        onChange={((e) => onDatasetChanged({ excludeDirRegex: e.target.value }))}
                    />
                    <label htmlFor="datasetIsRecursive">
                        <input
                            id="datasetIsRecursive"
                            name="datasetIsRecursive"
                            type="checkbox"
                            checked={dataset.isRecursive}
                            onChange={((e) => onDatasetChanged({ isRecursive: e.target.checked }))}
                        />
                        <span>Should include directories recursively ?</span>
                    </label>

                    <button type="button" onClick={() => props.onSubmit(dataset)}>
                        {props.submitButton}
                    </button>
                </form>
            </section>
        </Modal >
    )
}