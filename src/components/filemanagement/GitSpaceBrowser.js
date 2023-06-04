//Todo, gitspace by tab
// please display "branch name" at tap name not gitspace
// please display "branch's sha" at folderchain's base name. 
// you can easily add git space tab by clicking '+' button. 
// if workspace is not managed by git, when you click '+' git will be initiate your work space.

import React, { useState, useEffect, useCallback } from 'react';
import { FileNavbar, FileToolbar, FileList, FileContextMenu, FileBrowser, ChonkyActions, defineFileAction, ChonkyIconName } from "chonky";

const { ipcRenderer } = window.require('electron');

const readGitStatus = async (RootPath, DirectoryPath) => {
    try {
        const files = await ipcRenderer.invoke('GM_readGit', RootPath, DirectoryPath);
        return files;
    } catch {
        console.log('Error! chonkDir');
        return [];
    }
};

const GitBrowser = ({ directoryPath, setDirectoryPath, folderChain}) => {
    const [files, setFiles] = useState([]);
    const Untrack = defineFileAction({
        id: 'Untrack',
        button: {
            name: 'Untrack',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.flash,
        },
    });

    const Rename = defineFileAction({
        id: 'Restore',
        button: {
            name: 'Rename',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.flash,
        },
    });

    const Delete = defineFileAction({
        id: 'Delete',
        button: {
            name: 'Delete',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.flash,
        },
    });

    const RestoreFile = defineFileAction({
        id: 'RestoreFile',
        button: {
            name: 'RestoreFile',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.flash,
        },
    });


    const fileActions = [Untrack, Rename, Delete, RestoreFile];

    
    useEffect(() => {
        readGitStatus(folderChain[0].id, directoryPath).then(fetchedFiles => {
            if (Array.isArray(fetchedFiles)) {
                setFiles(fetchedFiles);
            } else {
                console.log("error reading directory");
            }
        });
        console.log(folderChain);
    }, [directoryPath]);

    const handleFileAction = useCallback((data) => {
        if (data.id === ChonkyActions.OpenFiles.id) {
            if (data.payload.files && data.payload.files.length !== 1) return;
            if (!data.payload.targetFile || !data.payload.targetFile.isDir) return;
            setDirectoryPath(data.payload.targetFile.id);
        }
    }, []);



    return (
        <div style={{ height: 500 }}>
            <FileBrowser files = {files} folderChain = {folderChain} fileActions={fileActions} onFileAction={handleFileAction}>
                <FileNavbar />
                <FileToolbar />
                <FileList />
                <FileContextMenu />
            </FileBrowser>
        </div>
    );
};

export default GitBrowser;