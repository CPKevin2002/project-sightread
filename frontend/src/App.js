import React, { useEffect, useState } from 'react'
import './App.css';
import JSZip from 'jszip';
import OSMDReactComponent from './OpenSheetMusicDisplay';
import TopBar from './TopBar';


const arrayBufferToBinaryString = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binaryString = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return binaryString;
};

function App() {
  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = async (event) => {
    event.preventDefault();

    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

    if (!files || files.length === 0) {
      console.log("invalid file");
      return;
    }

    let filename = files[0].name;

    if (filename.toLowerCase().indexOf(".mxl") < 0 
    && filename.toLowerCase().indexOf(".musicxml") < 0 
    && filename.toLowerCase().indexOf(".xml") < 0) {
      alert("No valid .xml/.mxl/.musicxml file!");
    }


    if (filename.toLowerCase().indexOf(".mxl") > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const binaryString = arrayBufferToBinaryString(reader.result);
        setFileContent(binaryString);
      };
      reader.onerror = (error) => {
        console.error("Error reading .mxl file:", error);
      };
      reader.readAsArrayBuffer(files[0]);
    } else {
      const formData = new FormData();
        formData.append('file', files[0]);

        try {
            const response = await fetch('http://localhost:8000/api/convert_musicxml/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.log(response.status);
                throw new Error('Network response was not ok');
            }
            const fileData = await response.arrayBuffer();
            const binaryString = arrayBufferToBinaryString(fileData);
            setFileContent(binaryString);
        } catch (error) {
            console.error('Error:', error);
        }
    }

        
  };

  const handleGenerateScore = async () => {
    const response = await fetch ('http://localhost:8000/api/random-sheet/');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const fileData = await response.arrayBuffer();
    const binaryString = arrayBufferToBinaryString(fileData);
    setFileContent(binaryString);
  };


  const handlePracticeScale = async () => {
    const scaleParams = {
      key: 'D',
      start: 'C4',
      end: 'C5'
    };
    const queryParams = new URLSearchParams(scaleParams).toString();
    const response = await fetch (`http://localhost:8000/api/generate-scale/?${queryParams}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const fileData = await response.arrayBuffer();
    const binaryString = arrayBufferToBinaryString(fileData);
    setFileContent(binaryString);
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


