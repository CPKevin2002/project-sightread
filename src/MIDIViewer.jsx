import React, { useState, useEffect } from 'react';

// Assuming NoteMatcher is in the same directory
import NoteMatcher from './noteMatcher';

const MIDIViewer = () => {
    const [activeNotes, setActiveNotes] = useState(new Set());

    useEffect(() => {
        // Dummy cursor object for NoteMatcher
        const cursor = { show: () => {}, Iterator: { EndReached: false, FrontReached: false } };
        const noteMatcher = new NoteMatcher(cursor);

        // Function to update active notes
        const updateActiveNotes = () => {
            setActiveNotes(new Set(noteMatcher.notesPressed));
        };

        // Bind the update function to the noteMatcher's MIDI event handler
        const originalMIDIEvent = noteMatcher.onMIDIEvent.bind(noteMatcher);
        noteMatcher.onMIDIEvent = (midiMessage) => {
            originalMIDIEvent(midiMessage);
            updateActiveNotes();
        };

        return () => {
            // Clean up: remove the MIDI event listener
            // (Depends on your implementation in NoteMatcher)
        };
    }, []);

    return (
        <div>
            <h2>Active MIDI Notes</h2>
            <ul>
                {[...activeNotes].map((note, index) => (
                    <li key={index}>Note: {note}</li>
                ))}
            </ul>
        </div>
    );
};

export default MIDIViewer;
