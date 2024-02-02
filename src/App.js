import './App.css';
import OSMDReactComponent from './OpenSheetMusicDisplay';
import WelcomeScreen from './WelcomeScreen';
import React, { useState } from 'react';


function App() {
  const [fileContent, setFileContent] = useState(null);

  const handleFileLoaded = (content) => {
    setFileContent(content);
  };

  return (
    <div className="App">
      {fileContent ? (
        <OSMDReactComponent file={fileContent} />
      ) : (
        <WelcomeScreen onFileLoaded={handleFileLoaded} />
      )}
    </div>
  );
}
export default App;
