import React, { useState, useEffect, useCallback } from 'react';
import {FileNavbar, FileToolbar, FileList, FileContextMenu, FileBrowser, ChonkyActions, defineFileAction, ChonkyIconName} from "chonky";
//hello
const { ipcRenderer } = window.require('electron');

const readGitStatus = async (DirectoryPath) => {
    try{
        const files = await ipcRenderer.invoke('GM_readGit', DirectoryPath);
        return files;
    } catch {
        console.log('Error! chonkDir');
        return [];
    }
};

const ReadBaseName = async (DirectoryPath) => {
    try{
        const BaseName = await ipcRenderer.invoke('GM_getFolderChain', DirectoryPath);
        return BaseName;
    } catch {
        console.log('Error to read BaseName');
        return null;
    }
}
const GitBrowser = () => {
    const [directoryPath, setDirectoryPath] = useState('./');
    const [files, setFiles] = useState([]);
    const [folderChain, setFolderChain] = useState([]);

    const Untrack = defineFileAction({
        id : 'Untrack',
        button: {
            name: 'Untrack',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.flash,
        },
    });

    const Rename = defineFileAction({
        id : 'Restore',
        button: {
            name: 'Rename',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.flash,
        },
    });

    const Delete = defineFileAction({
        id : 'Delete',
        button: {
            name: 'Delete',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.flash,
        },
    });

    const RestoreFile = defineFileAction({
        id : 'RestoreFile',
        button: {
            name: 'RestoreFile',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.flash,
        },
    });

    const fileActions = [Untrack, Rename, Delete, RestoreFile];

    const handleFileAction = useCallback((data) => {
        if (data.id === ChonkyActions.OpenFiles.id) {
            if (data.payload.files && data.payload.files.length !== 1) return;
            if (!data.payload.targetFile || !data.payload.targetFile.isDir) return;
            setDirectoryPath(data.payload.targetFile.id);
        }
    }, []);
    

    useEffect(() => {
        ipcRenderer.on('RootNameChanged', (_, newRootPath) => {
          console.log('newPath allocated : ',newRootPath);
          setDirectoryPath(newRootPath);
        });
        return () => {
          ipcRenderer.removeAllListeners('RootPathChanged');
        };
      }, []);


    return(
        <div style = {{height : 500}}>
            <FileBrowser files={files} folderChain = {folderChain} fileActions={fileActions} onFileAction={handleFileAction} darkMode ={true}>
                <FileNavbar />
                <FileToolbar />
                <FileList />
                <FileContextMenu />
            </FileBrowser>
        </div>
    );
};

export default GitBrowser;