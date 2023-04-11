import { useAppSelector } from '@/app/hooks';
import { getDatasetEvaluateStatus } from '@/store/dataset';

import '@/components/StatusBox.css';

export default function StatusBox() {
    const datasetEvaluateStatus = useAppSelector(getDatasetEvaluateStatus)

    if (datasetEvaluateStatus === null || (datasetEvaluateStatus.current === datasetEvaluateStatus.total)) {
        return null
    }

    const percent = datasetEvaluateStatus.current * 100 / datasetEvaluateStatus.total;

    return (
        <div className='status-box'>
            <span>{`${percent.toFixed(2)}% (${datasetEvaluateStatus.current}/${datasetEvaluateStatus.total})`}</span>
            <span className='msg'>{datasetEvaluateStatus.status}</span>
        </div>
    );
}