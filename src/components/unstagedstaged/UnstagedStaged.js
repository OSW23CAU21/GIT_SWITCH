import React, { useState } from 'react';
import FileList from './FileList';

/**
 * For untracked files:
 *  Adding the new files into a staging area (untracked -> staged; git add)
 *  For modified files
 *  Adding the modified files into a staging area (modified -> staged; git add)
 *  Undoing the modification (modified -> unmodified; git restore)
 *  For staged files
 * Unstaging changes (staged -> modified or untracked; git restore --staged)
 *  For committed or unmodified files
 *  Untracking files (committed -> untracked; git rm --cached)
 *  Deleting files (committed -> staged; git rm)
 *  Renaming files (committed -> staged; git mv)
 */

const initialFiles = [
    { name: 'file1.txt', staged: false },
    { name: 'file2.txt', staged: false },
    { name: 'file3.txt', staged: false },
];


const UnstagedStaged = () => {
    const [files, setFiles] = useState(initialFiles);

    const handleFileSelect = (selectedFiles, staged) => {
        const updatedFiles = files.map((file) =>
            selectedFiles.includes(file) ? { ...file, staged } : file
        );
        setFiles(updatedFiles);
    };

    return (
        <div>
            <h1>Staged 영역</h1>
            <FileList
                files={files.filter((file) => file.staged)}
                onFileSelect={(selectedFiles) => handleFileSelect(selectedFiles, false)}
            />
            <h1>Unstaged 영역</h1>
            <FileList
                files={files.filter((file) => !file.staged)}
                onFileSelect={(selectedFiles) => handleFileSelect(selectedFiles, true)}
            />
        </div>
    );

};

export default UnstagedStaged;
