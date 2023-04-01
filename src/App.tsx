import React, { useState, useEffect } from 'react';
import './App.css';
import CropImage from './components/CropImage';
import PromptEditor from './components/Prompt/PromptEditor';
import Sidebar from './components/Sidebar';

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

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
