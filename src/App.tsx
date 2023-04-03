import '@/App.css';
import Sidebar from '@/components/Sidebar';
import FileEditor from '@/components/FileEditor/FileEditor';
import Explorer from '@/components/Explorer';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import DatasetList from './components/DatasetList';

export default function App() {
  const selectedDataset = useAppSelector((state: RootState) => state.selectedDataset.dataset)

  if(selectedDataset == null)
    return (<div className='app'><DatasetList /></div>)

  return (
    <div className='app'>
      <Sidebar>
        <Explorer />
      </Sidebar>
      <FileEditor />
    </div>
  );
}