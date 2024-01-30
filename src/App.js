import React from 'react';
import './App.css';
import OSMDReactComponent from './OpenSheetMusicDisplay';
import MIDIConnection from './MIDIConnection';
import MIDIViewer from './MIDIViewer';
import SheetMusicViewer from './SheetMusicViewer';


function App() {
  const sampleMusicXmlUrl = process.env.PUBLIC_URL + '/Prelude_C_Major_-_Bach.mxl';

  const handleExit = () => {
    // Handle the exit logic here
    console.log('Exit button clicked');
  };

  return (
    <div className="App">
      {/* <OSMDReactComponent file={sampleMusicXmlUrl}/> */}
      {/* <MIDIConnection /> */}
      {/* <NoteMatchingComponent file={sampleMusicXmlUrl}/> */}
      {/* <MIDIViewer /> */}
      <SheetMusicViewer />
    </div>
  );
}

export default App;
