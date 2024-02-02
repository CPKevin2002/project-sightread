import React from 'react';
import './TopBar.css'; // Make sure to create a corresponding CSS file for styling

const TopBar = ({ onBack }) => {
  return (
    <div className="top-bar">
      <button className="back-button" onClick={onBack}>
        Back
      </button>
    </div>
  );
};

export default TopBar;
