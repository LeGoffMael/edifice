import { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from '@/components/Sidebar';
import FileEditor from '@/components/FileEditor/FileEditor';
import Explorer from '@/components/Explorer';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';

import '@/App.css';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDataset = useAppSelector((state: RootState) => state.selectedDataset.dataset)

  useEffect(() => {
    if (selectedDataset === null) {
      navigate('/dataset-list', { state: { background: location } });
    }
  }, []);

  return (
    <div className='app'>
      <Sidebar>
        <Explorer />
      </Sidebar>
      <FileEditor />
    </div>
  );
}