import React, { useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

const OSMDReactComponent = ({ file }) => {
  const osmdContainerRef = useRef();

  useEffect(() => {
    const osmd = new OpenSheetMusicDisplay(osmdContainerRef.current, {
      autoResize: true,
      backend: 'svg'
    });

    osmd.load(file).then(() => osmd.render());
  }, [file]);

  return <div ref={osmdContainerRef} />;
};

export default OSMDReactComponent;
