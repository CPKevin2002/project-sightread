import './App.css';
import OSMDReactComponent from './OpenSheetMusicDisplay';
import WelcomeScreen from './WelcomeScreen';
import TopBar from './TopBar';
import React, { useState } from 'react';


function App() {
  const [fileContent, setFileContent] = useState(null);

  const handleFileLoaded = (content) => {
    setFileContent(content);
  };

  const handleBack = () => {
    setFileContent(null); // Reset the file to null to go back to the welcome screen
  };

  return (
    <div className="App">
      {fileContent ? (
        <OSMDReactComponent file={fileContent} onBack={handleBack} />
      ) : (
        <WelcomeScreen onFileLoaded={handleFileLoaded} />
      )}
    </div>
  );
}
export default App;
