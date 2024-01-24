import React, { useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';


const NoteMatchingComponent = ({ file }) => {

  const osmdContainerRef = useRef();

  useEffect(() => {
    const osmd = new OpenSheetMusicDisplay(osmdContainerRef.current, {
      autoResize: true,
      backend: 'svg'
    });
    osmd.load(file).then(() => {
    const cursor = osmd.cursor;
    const notes = cursor.NotesUnderCursor();
    console.log("cursor is obtained");
  });
   
  }, [file]);

  return <div ref={osmdContainerRef} />;
  };

export default NoteMatchingComponent;