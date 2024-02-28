import React, { useRef, useEffect, useState, useCallback } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import TopBar from './TopBar';
import MockMIDI from './MockMIDI';
import NoteMatcher from './noteMatcher';

const OSMDReactComponent = ({ file, onBack }) => {
  const osmdContainerRef = useRef(null);
  const osmdRef = useRef(null);
  const [cursor, setCursor] = useState(null);
  const [noteMatcher, setNoteMatcher] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleCursorMove = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  const loadAndRenderOSMD = useCallback(() => {
    if (osmdContainerRef.current && !osmdRef.current) {
      osmdRef.current = new OpenSheetMusicDisplay(osmdContainerRef.current, {
        autoResize: true,
        backend: 'svg',
        drawTitle: true,
      });
      console.log("reload shit!");

      osmdRef.current?.load(file)
        .then(() => {

          console.log("reload shit2!");
          osmdRef.current.render();
          const newCursor = osmdRef.current.cursor;
          setCursor(newCursor);
          if (!noteMatcher) { // Initialize NoteMatcher only once
            const m = new NoteMatcher(newCursor, osmdRef.current.sheet, handleCursorMove);
            console.log('New note matcher has been initialized!');
            setNoteMatcher(m);
          }
        })
        .catch(error => console.error('Could not load the sheet music:', error));
    }

    osmdRef.current.render();



  }, [file, noteMatcher, handleCursorMove]);

  // Initial load
  useEffect(() => {
    loadAndRenderOSMD();
    console.log("use effect!~");
  }, [file, loadAndRenderOSMD]);

  // Re-render on refreshKey change
  useEffect(() => {
    loadAndRenderOSMD();
    console.log("use effect2!~");
  }, [refreshKey, loadAndRenderOSMD]);

  return (
    <>
      <TopBar onBack={onBack} />
      {noteMatcher && <MockMIDI noteMatcher={noteMatcher} />}
      <div ref={osmdContainerRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
};

export default OSMDReactComponent;
