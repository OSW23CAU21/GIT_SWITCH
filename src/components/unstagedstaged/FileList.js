import React, { useState } from 'react';
const { ipcRenderer } = window.require('electron');
const sendSelectedFiles = async (selectedFiles, length) => { //getting FileInfo from backend "main.js" using electron.
  console.log(selectedFiles);
  try {
    const result = await ipcRenderer.invoke('gitModify', selectedFiles, length);
  } catch {
    console.error('Error : gitModify');
  }
};

const FileList = ({ files, onFileSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileClick = file => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter(selected => selected !== file));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleButtonClick = () => {
    onFileSelect(selectedFiles);
    console.log('selectedFiles', selectedFiles);
    sendSelectedFiles(selectedFiles, selectedFiles.length);
    setSelectedFiles([]);
  };

  return (
    <ul>
      {files.map((file, index) => (
        <li
          key={index}
          onClick={() => handleFileClick(file)}
          style={{
            cursor: 'pointer',
            backgroundColor: selectedFiles.includes(file) ? 'lightblue' : '',
          }}
        >
          {file.name}
        </li>
      ))}
      <button onClick={handleButtonClick}>선택된 파일 이동</button>
    </ul>
  );
};

export default FileList;