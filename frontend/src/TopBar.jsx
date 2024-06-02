import React from 'react';
import './TopBar.css';

const TopBar = ({ onBack, onReplay }) => {
  return (
    <div className="top-bar">
      <button className="back-button" onClick={onBack}>
        Back to Menu
      </button>
      <button className="replay-button" onClick={onReplay}>
        Replay
      </button>
    </div>
  );
};

export default TopBar;
