import React, { useRef, useEffect, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import TopBar from './TopBar';
import MockMIDI from './MockMIDI';
import NoteMatcher from './noteMatcher';

const OSMDReactComponent = ({ file, onBack }) => {
  const osmdContainerRef = useRef(null);
  const osmdRef = useRef(null);
  const noteMatcherRef = useRef(null);
  const [, setNoteMatcherInitialized] = useState(false); // State to trigger re-renders
  const [, setCursorUpdate] = useState(0); // State to trigger re-renders on cursor move

  const onCursorMove = () => {
    // Trigger a re-render by updating the state
    setCursorUpdate(prev => prev + 1);
  };

  const onReplay = () => {
    if (noteMatcherRef.current) {
      noteMatcherRef.current.reset();
    }
  }

  useEffect(() => {
    if (osmdContainerRef.current) {
      osmdRef.current = new OpenSheetMusicDisplay(osmdContainerRef.current, {
        autoResize: true,
        backend: 'svg',
        drawTitle: true,
      });

      osmdRef.current.load(file).then(() => {
        osmdRef.current.render();
        const cursor = osmdRef.current.cursor;
        cursor.show();
        noteMatcherRef.current = new NoteMatcher(cursor, osmdRef.current.sheet, onCursorMove);
        setNoteMatcherInitialized(true); // Trigger a re-render
        console.log('New note matcher has been initialized!');
      }).catch(error => console.error('Could not load the sheet music:', error));
    }
  }, [file]);

  return (
    <>
      <TopBar onBack={onBack} onReplay={onReplay}/>
      {noteMatcherRef.current && <MockMIDI noteMatcher={noteMatcherRef.current} />}
      <div ref={osmdContainerRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
};

export default OSMDReactComponent;
