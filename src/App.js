import React from 'react';
import './App.css';
import OSMDReactComponent from './OpenSheetMusicDisplay';
import MIDIConnection from './MIDIConnection';
import MIDIViewer from './MIDIViewer';


function App() {
  const sampleMusicXmlUrl = process.env.PUBLIC_URL + '/Minuet_in_G_Major_Bach.mxl';

  const handleExit = () => {
    // Handle the exit logic here
    console.log('Exit button clicked');
  };

  return (
    <div className="App">
      <OSMDReactComponent file={sampleMusicXmlUrl}/>
      {/* <MIDIConnection /> */}
      {/* <NoteMatchingComponent file={sampleMusicXmlUrl}/> */}
      {/* <MIDIViewer /> */}
    </div>
  );
}

export default App;
