import React, { useState } from 'react';
import FileUploadComponent from './FileUpload';
import OSMDReactComponent from './OpenSheetMusicDisplay';

const SheetMusicViewer = () => {
  const [file, setFile] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  return (
    <div>
      <FileUploadComponent onFileSelect={handleFileSelect} />
      {file && <OSMDReactComponent file={file} />}
    </div>
  );
};

export default SheetMusicViewer;
