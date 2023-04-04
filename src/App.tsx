import { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from '@/components/Sidebar';
import FileEditor from '@/components/FileEditor/FileEditor';
import Explorer from '@/components/Explorer';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { datasetsRoute } from '@/index';

import '@/App.css';

export default function App() {
  const navigate = useNavigate();
  const selectedDataset = useAppSelector((state: RootState) => state.selectedDataset.dataset)

  useEffect(() => {
    if (selectedDataset === null) {
      navigate(datasetsRoute);
    }
  }, []);

  return (
    <div className='app'>
      <Sidebar>
        <Explorer />
      </Sidebar>
      <FileEditor />
      {/* will contains the modals */}
      <Outlet />
    </div>
  );
}