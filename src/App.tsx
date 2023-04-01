import './App.css';
import CropImage from './components/CropImage';
import PromptEditor from './components/Prompt/PromptEditor';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className='app'>
      <Sidebar />
      <div className='app-main'>
        <CropImage />
        <PromptEditor />
      </div>
    </div>
  );
}

export default App;
