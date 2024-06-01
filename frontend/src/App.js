import React, { useEffect, useState } from 'react'
import './App.css';
import JSZip from 'jszip';
import OSMDReactComponent from './OpenSheetMusicDisplay';
import TopBar from './TopBar';

function App() {
  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = async (event) => {
    event.preventDefault();

    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

    if (!files || files.length === 0) {
      console.log("invalid file");
      return;
    }

    const reader = new FileReader();
    let filename = files[0].name;

    reader.onload = async (event) => {
      let fileData = event.target.result;
      setFileContent(fileData);
    };

    reader.onerror = (event) => {
      console.error("File could not be read: " + event.target.error.code);
    };

    if (filename.toLowerCase().indexOf(".xml") > 0
      || filename.toLowerCase().indexOf(".musicxml") > 0) {
      reader.readAsText(files[0]);
    } else if (filename.toLowerCase().indexOf(".mxl") > 0) {
      reader.readAsBinaryString(files[0]);
    } else {
      alert("No valid .xml/.mxl/.musicxml file!");
    }
  };

  const handleGenerateScore = () => {
    fetch('http://localhost:8000/api/random-sheet/')
      .then(response => response.json())
      .then(data => {
        setFileContent(data.mxl);
      })
      .catch(error => {
        console.error('Error fetching random music sheet:', error);
        alert('Failed to generate random score. Please try again.');
      });
  };

  const handlePracticeScale = () => {
    const scaleParams = {
      key: 'D',
      start: 'C4',
      end: 'C5'
    };
    const queryParams = new URLSearchParams(scaleParams).toString();

    fetch(`http://localhost:8000/api/generate-scale/?${queryParams}`)
      .then(response => response.json())
      .then(data => {
        setFileContent(data.music_xml);
      })
      .catch(error => {
        console.error('Error fetching scale:', error);
        alert('Failed to generate scale. Please try again.');
      });
  };

  const handleBack = () => {
    setFileContent(null);
  };


  return (
    <div className="App">
      {fileContent ? (
        <OSMDReactComponent file={fileContent} onBack={handleBack} />
      ) : (
        <div className="welcome-screen">
          <h1>Project Sightread</h1>
          <div className="buttons-container">
            <input
              type="file"
              id="file-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".xml,.musicxml,.mxl"
            />
            <label htmlFor="file-input" className="button upload-button">
              Upload music sheet
            </label>
            <button className="button generate-button" onClick={handleGenerateScore}>
              Generate Random Score
            </button>
            <button className="button practice-scale-button" onClick={handlePracticeScale}>
              Practice Scale
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


