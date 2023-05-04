import React, { useState } from 'react';

const FileList = ({ files }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileClick = (file) => {
        if (selectedFiles.includes(file)) {
            setSelectedFiles(selectedFiles.filter((selected) => selected !== file));
        } else {
            setSelectedFiles([...selectedFiles, file]);
        }
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
            {selectedFiles.length > 0 && (
                <div>
                    선택된 파일:
                    {selectedFiles.map((file, index) => (
                        <span key={index}>{file.name}, </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileList;