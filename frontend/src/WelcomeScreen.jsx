import React, { useState } from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onFileLoaded }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    const filename = file.name;
    reader.onload = (event) => {
      // Pass the file content back to the parent component
      onFileLoaded(event.target.result);
    };
    reader.onerror = (event) => {
      console.error("File could not be read: " + event.target.error.code);
    };

    // Determine how to read the file based on the file extension
    if (filename.toLowerCase().endsWith(".xml") || filename.toLowerCase().endsWith(".musicxml")) {
      reader.readAsText(file); // Read the file content as text (string)
    } else if (filename.toLowerCase().endsWith(".mxl")) {
      reader.readAsBinaryString(file); // Read the file content as binary string
    } else {
      alert("Please upload a valid .xml/.mxl/.musicxml file!");
    }
  };

  const handleGenerateScore = () => {
    // Call the Django backend to generate a random music score
    fetch('http://localhost:8000/api/random-sheet/')
      .then(response => response.json())
      .then(data => {
        // Assuming the backend returns a JSON object with a music_xml field
        onFileLoaded(data.music_xml);
      })
      .catch(error => {
        console.error('Error fetching random music sheet:', error);
        alert('Failed to generate random score. Please try again.');
      });
  };

  return (
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
      </div>
    </div>
  );
};

export default WelcomeScreen;
