import { MouseEventHandler, useEffect } from 'react';
import { getAllDatasets, fetchDatasets } from '@/store/allDatasets'
import { fetchDataset } from '@/store/dataset';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { Dataset } from '@/types/dataset';

import '@/components/DatasetList.css';

type DatasetItemProps = {
  dataset: Dataset;
  onClick: MouseEventHandler<HTMLDivElement>;
};

function DatasetItem(props: DatasetItemProps) {
    return (
        <div
            className='dataset-item'
            onClick={props.onClick}
        >
            <h3>{props.dataset.name}</h3>
            <div>
                <span>{props.dataset.path}</span>
                {props.dataset.filesCount !== undefined && <span>{props.dataset.filesCount} files</span>}
                {props.dataset.idealSize !== undefined && <span>{props.dataset.idealSize.width}x{props.dataset.idealSize.height}</span>}
            </div>
        </div>
    );
}

export default function DatasetList() {
    const dispatch = useAppDispatch()
    const datasets = useAppSelector(getAllDatasets)
    const status = useAppSelector((state: RootState) => state.datasets.status)
    const error = useAppSelector((state: RootState) => state.datasets.error)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDatasets())
        }
    }, [status, dispatch])


    let content

    if (status === 'loading') {
        content = <p className='status'>Loading...</p>
    } else if (status === 'succeeded') {
        content = datasets.map(((item) => (
            <DatasetItem
                key={item.id}
                dataset={item}
                onClick={() => dispatch(fetchDataset(item))}
            />
        )))
    } else if (status === 'failed') {
        content = <div className='status'>{error}</div>
    }

    return (
        <section className='datasets'>
            <div className='datasets-title'>
                <h2>Datasets</h2>
                <span>{datasets.length} elements</span>
            </div>
            <div className='datasets-list'>
                {content}
            </div>
        </section>
    );
}