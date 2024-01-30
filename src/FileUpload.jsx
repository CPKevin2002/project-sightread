import React, { useState } from 'react';

const FileUploadComponent = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {selectedFile && <p>File selected: {selectedFile.name}</p>}
    </div>
  );
};

export default FileUploadComponent;
