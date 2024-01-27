import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';


const OSMDReactComponent = ({ file }) => {
  const osmdContainerRef = useRef();
  const [cursorChanged, setCursorChanged] = useState(false);

  useEffect(() => {
    const osmd = new OpenSheetMusicDisplay(osmdContainerRef.current, {
      autoResize: true,
      backend: 'svg'
    });

    osmd.load(file).then(() => {
      osmd.render();
      iterateCursor(osmd.cursor);
    });
  }, [file]); // Depend on `file` to reload OSMD when the file changes

  useEffect(() => {
    // Effect to handle cursor changes
    // You can put logic here that needs to run when the cursor changes
    if (cursorChanged) {
      // Reset the state to allow for future changes
      setCursorChanged(false);
      // Any additional logic for when the cursor changes
    }
  }, [cursorChanged]); // Depend on `cursorChanged`

  const iterateCursor = (cursor) => {
    cursor.reset();
    cursor.show();
    while (!cursor.Iterator.EndReached) {
      console.log("advance!");
      cursor.next();
    }
    cursor.reset();
    // Call this to trigger a re-render
    setCursorChanged(true);
  };

  return <div ref={osmdContainerRef} />;
};

export default OSMDReactComponent;
