import React from 'react';
import './App.css';
import OSMDReactComponent from './OpenSheetMusicDisplay';
import MIDIConnection from './MIDIConnection';

function App() {
  const sampleMusicXmlUrl = process.env.PUBLIC_URL + '/BeetAnGeSample.musicxml';

  const handleExit = () => {
    // Handle the exit logic here
    console.log('Exit button clicked');
  };

  return (
    <div className="App">
      <OSMDReactComponent file={sampleMusicXmlUrl}/>
      {/* <MIDIConnection /> */}
      {/* <NoteMatchingComponent file={sampleMusicXmlUrl}/> */}
    </div>
  );
}

export default App;
