import React, { useState, useEffect, useCallback } from 'react';
import {FileNavbar, FileToolbar, FileList, FileContextMenu, FileBrowser, ChonkyActions, defineFileAction, ChonkyIconName} from "chonky";

const { ipcRenderer } = window.require('electron');

const ReadDirectory = async (DirectoryPath) => {
    try{
        const files = await ipcRenderer.invoke('FM_ReadDirectory', DirectoryPath);
        return files;
    } catch {
        console.log('Error! chonkDir');
        return [];
    }
};

const ReadBaseName = async (DirectoryPath) => {
    try{
        const BaseName = await ipcRenderer.invoke('FM_getFolderChain', DirectoryPath);
        return BaseName;
    } catch {
        console.log('Error to read BaseName');
        return null;
    }
}
const FileManagement = () => {
    const [directoryPath, setDirectoryPath] = useState('./');
    const [files, setFiles] = useState([]);
    const [folderChain, setFolderChain] = useState([]);

    const CreateFile = defineFileAction({
        id : 'CreateFile',
        button: {
            name: 'CreateFile',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.flash,
        },
    });

    const Rename = defineFileAction({
        id : 'Rename',
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

    const fileActions = [CreateFile, Rename, Delete];

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

    useEffect(() => {
        ReadDirectory(directoryPath).then(fetchedFiles => {
            if (Array.isArray(fetchedFiles)) {
                setFiles(fetchedFiles);
            } else {
                console.log("error reading directory");
            }
        });
    }, [directoryPath]);

    useEffect(() => {
        ReadBaseName(directoryPath).then(fetchedName => {
            setFolderChain(prevFolderChain => {
                const isIndex = prevFolderChain.findIndex(item => item.id === fetchedName[0]);
                if (isIndex !== -1) {
                    return prevFolderChain.slice(0, isIndex + 1);
                } else {
                    return [...prevFolderChain, {id: fetchedName[0], name: fetchedName[1], isDir: true}];
                }
            });
        });
    }, [directoryPath]);

    return(
        <div style = {{height : 500}}>
            <FileBrowser files={files} folderChain = {folderChain} fileActions={fileActions} onFileAction={handleFileAction} darkMode = {true} >
                <FileNavbar />
                <FileToolbar />
                <FileList />
                <FileContextMenu />
            </FileBrowser>
        </div>
    );
};

export default FileManagement;