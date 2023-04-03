import '@/App.css';
import Sidebar from '@/components/Sidebar';
import FileEditor from '@/components/FileEditor/FileEditor';
import Explorer from '@/components/Explorer';

export default function App() {
  return (
    <div className='app'>
      <Sidebar>
        <Explorer />
      </Sidebar>
      <FileEditor />
    </div>
  );
}