import React, { useState } from 'react';

const FileList = ({ files, onFileSelect }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileClick = (file) => {
        if (selectedFiles.includes(file)) {
            setSelectedFiles(selectedFiles.filter((selected) => selected !== file));
        } else {
            setSelectedFiles([...selectedFiles, file]);
        }
    };

    const handleButtonClick = () => {
        onFileSelect(selectedFiles);
        setSelectedFiles([]);
    };

    return (
        <div>
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
            </ul>
            <button onClick={handleButtonClick}>선택된 파일 이동</button>
        </div>
    );
};


export default FileList;