import React, {useRef, useEffect, useState, useCallback} from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import TopBar from './TopBar';
import MockMIDI from "./MockMIDI";
import NoteMatcher from './noteMatcher';

const OSMDReactComponent = ({ file, onBack }) => {
  const osmdContainerRef = useRef(null);
  const osmdRef = useRef(null);
  const [cursor, setCursor] = useState(null);
  const [noteMatcher, setNoteMatcher] = useState(null);

    const [refreshKey, setRefreshKey] = useState(0); // Add a state to trigger re-renders

    const handleCursorMove = useCallback(() => {
        setRefreshKey(prevKey => prevKey + 1); // Increment to trigger a re-render
    }, []);




  useEffect(() => {
    if (osmdContainerRef.current && !osmdRef.current) {
      osmdRef.current = new OpenSheetMusicDisplay(osmdContainerRef.current, {
        autoResize: true,
        backend: "svg",
        drawTitle: true,
      });

      osmdRef.current.load(file)
          .then(() => {
            osmdRef.current.render();
            const newCursor = osmdRef.current.cursor;
            setCursor(newCursor); // Update cursor state
              const m = new NoteMatcher(newCursor, osmdRef.current.sheet, handleCursorMove);
              console.log("new note matcher has been initialized!");
            setNoteMatcher(m);
          })
          .catch(error => console.error("Could not load the sheet music:", error));
    }
  }, [file, refreshKey]);

  return (
      <>
        <TopBar onBack={onBack} />
        {noteMatcher && <MockMIDI noteMatcher={noteMatcher} />}
        <div ref={osmdContainerRef} style={{ width: "100%", height: "100%" }} />
      </>
  );
};

export default OSMDReactComponent;
