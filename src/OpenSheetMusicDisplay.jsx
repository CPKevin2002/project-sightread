import React, { useRef, useEffect } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import NoteMatcher from './noteMatcher';


const OSMDReactComponent = ({ file }) => {
  const osmdContainerRef = useRef(null);
  const osmdRef = useRef(null);

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
           // let test = this.cursor.show();
          let m = new NoteMatcher(osmdRef.current.cursor, osmdRef.current.sheet);
        })
        .catch(error => console.error("Could not load the sheet music:", error));
    }
  }, [file]);

  return <div ref={osmdContainerRef} style={{ width: "100%", height: "100%" }} />;
};

export default OSMDReactComponent;
