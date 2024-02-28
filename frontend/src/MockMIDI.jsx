import React from 'react';
import NoteMatcher from './noteMatcher';

function MockMIDI({noteMatcher}) {
    const advanceCursor = () => {
        // Check if the NoteMatcher instance is valid and has the advanceMatcher method
        if (noteMatcher && noteMatcher.advanceMatcher) {
            noteMatcher.advanceMatcher();
            console.log('Cursor advanced.');
        } else {
            console.error('Invalid NoteMatcher instance.');
        }
    };

    return (
        <button onClick={advanceCursor}>Advance Cursor</button>
    );
}

export default MockMIDI;
