import React, { useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

const IterateCursor = ({cursor}) => {
  cursor.reset();
  cursor.show();
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
        IterateCursor(osmd.cursor);
      }
      );
  }, [file]);

  return <div ref={osmdContainerRef} />;
};

export default OSMDReactComponent;
