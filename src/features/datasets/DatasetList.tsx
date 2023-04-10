import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getAllDatasets, fetchDatasets, getAllDatasetsStatus } from '@/store/allDatasets'
import { deleteDataset, fetchDataset, getDataset } from '@/store/dataset';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Dataset } from '@/types/dataset';
import Modal from '@/components/Modal';
import { addDatasetRoute, editDatasetRoute } from '@/index';

import '@/features/datasets/DatasetList.css';

type DatasetItemProps = {
    dataset: Dataset;
};

function DatasetItem(props: DatasetItemProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()

    const clickDataset = () => {
        navigate('/'); // go to home
        dispatch(fetchDataset(props.dataset));
    }

    const clickDeleteDataset = () => {
        dispatch(deleteDataset(props.dataset.id));
    }

    return (
        <div
            className='dataset-item'
            onClick={clickDataset}
        >
            <h3>{props.dataset.name}</h3>
            <div>
                <div>
                    <span>{props.dataset.path}</span>
                    {props.dataset.filesCount !== undefined && <span>{props.dataset.filesCount} files</span>}
                    <span>{props.dataset.idealSize !== undefined ? `${props.dataset.idealSize.width}x${props.dataset.idealSize.height}` : 'No size'}</span>
                </div>
                {/* prevent to call `onClick` on click edit */}
                <Link to={editDatasetRoute + props.dataset.id} onClick={(e) => e.stopPropagation()}>Edit</Link>
                <Link to='#' onClick={(e) => { e.stopPropagation(); clickDeleteDataset(); }}>Delete</Link>
            </div>
        </div >
    );
}

export default function DatasetList() {
    const dispatch = useAppDispatch()
    const datasets = useAppSelector(getAllDatasets)
    const status = useAppSelector(getAllDatasetsStatus)
    const selectedDataset = useAppSelector(getDataset)

    useEffect(() => {
        if (status.isIdle()) {
            dispatch(fetchDatasets())
        }
    }, [status, dispatch])

    let content
    if (status.isLoading()) {
        content = <p className='status'>Loading...</p>
    } else if (status.isSucceeded()) {
        content = datasets.map(((item) => (
            <DatasetItem
                key={item.id}
                dataset={item}
            />
        )))
    } else if (status.isFailed()) {
        content = <div className='status'>{status.error}</div>
    }

    return (
        <Modal canPop={selectedDataset !== null}>
            <div className='datasets-title'>
                <div>
                    <h2>Datasets</h2>
                    <span>{datasets.length} elements</span>
                </div>
                <Link to={addDatasetRoute}>Add Dataset</Link>
            </div>
            <div className='datasets-list'>
                {content}
            </div>
        </Modal >
    );
}