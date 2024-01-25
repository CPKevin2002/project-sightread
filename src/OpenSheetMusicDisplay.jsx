import React, { useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

const iterateCursor = (cursor) => {
  cursor.reset();
  cursor.show();
  cursor.next();
  cursor.next();
}

const OSMDReactComponent = ({ file }) => {
  const osmdContainerRef = useRef();

  
  useEffect(() => {

    const osmd = new OpenSheetMusicDisplay(osmdContainerRef.current, {
      autoResize: true,
      backend: 'svg'
    });

    osmd.load(file).then(
      () => {
        osmd.render();
        iterateCursor(osmd.cursor);
      }
      );
  }, []);

  return <div ref={osmdContainerRef} />;
};

export default OSMDReactComponent;
