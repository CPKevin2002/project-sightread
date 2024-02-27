import React, { useState } from 'react';
import './App.css';
import OSMDReactComponent from './OpenSheetMusicDisplay';
import TopBar from './TopBar';

function App() {
  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    const filename = file.name;
    reader.onload = (event) => {
      // Pass the file content back to the component's state
      setFileContent(event.target.result);
    };
    reader.onerror = (event) => {
      console.error("File could not be read: " + event.target.error.code);
    };

    if (filename.toLowerCase().endsWith(".xml") || filename.toLowerCase().endsWith(".musicxml")) {
      reader.readAsText(file);
    } else if (filename.toLowerCase().endsWith(".mxl")) {
      reader.readAsBinaryString(file);
    } else {
      alert("Please upload a valid .xml/.mxl/.musicxml file!");
    }
  };

  const handleGenerateScore = () => {
    fetch('http://localhost:8000/api/random-sheet/')
        .then(response => response.json())
        .then(data => {
          setFileContent(data.music_xml);
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
