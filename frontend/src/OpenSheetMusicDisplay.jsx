import React, { useRef, useEffect, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import NoteMatcher from './noteMatcher';
import TopBar from './TopBar';


const OSMDReactComponent = ({ file, onBack }) => {

  const osmdContainerRef = useRef(null);
  const osmdRef = useRef(null);
  const [cursor, setCursor] = useState(null);

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
          setCursor(osmdRef.current.cursor); 
          let m = new NoteMatcher(osmdRef.current.cursor, osmdRef.current.sheet);
        })
        .catch(error => console.error("Could not load the sheet music:", error));
    } 
  }, []);

  useEffect(() => {}, [cursor]); 

  return <>
  <TopBar onBack={onBack} />
  <div ref={osmdContainerRef} style={{ width: "100%", height: "100%" }} /> 
  </>;
};

export default OSMDReactComponent;
