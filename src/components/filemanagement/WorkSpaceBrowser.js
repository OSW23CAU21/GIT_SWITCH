import React, { useState, useEffect, useCallback } from 'react';
import { FileNavbar, FileToolbar, FileList, FileContextMenu, FileBrowser, ChonkyActions, defineFileAction, ChonkyIconName} from "chonky";

const { ipcRenderer } = window.require('electron');
const actionsToDisable = [
    ChonkyActions.ToggleHiddenFiles.id,
    ChonkyActions.SortFilesByDate.id,
    ChonkyActions.SortFilesBySize.id,
    ChonkyActions.OpenSelection.id,
    ChonkyActions.SelectAllFiles.id,
    ChonkyActions.ClearSelection.id,
];


const ReadDirectory = async (DirectoryPath) => {
    try {
        const files = await ipcRenderer.invoke('FM_ReadDirectory', DirectoryPath);
        return files;
    } catch {
        console.log('Error! chonkDir');
        return [];
    }
};

const FileBrowsers = ({ directoryPath, setDirectoryPath, folderChain }) => {
    const [files, setFiles] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    const CreateFile = defineFileAction({
        id: 'CreateFile',
        button: {
            name: 'Create File',
            toolbar: true,
            contextMenu: false,
            icon: ChonkyIconName.file,
        },
    });

    const Rename = defineFileAction({
        id: 'Rename',
        button: {
            name: 'Rename',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.clearSelection,
        },
    });

    const Delete = defineFileAction({
        id: 'Delete',
        button: {
            name: 'Delete',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.trash,
        },
    });

    const fileActions = [CreateFile, Rename, Delete, ChonkyActions.CreateFolder];

    const handleFileAction = useCallback((data) => {
        console.log(data);
        if (data.id === ChonkyActions.OpenFiles.id) {
            if (data.payload.files && data.payload.files.length !== 1) return;
            if (!data.payload.targetFile) return;
            if (data.payload.targetFile.isDir){
                setDirectoryPath(data.payload.targetFile.id);
            } else {
                ipcRenderer.invoke('FM_openFile', data.payload.targetFile.id);
            }
        }

        if (data.state.selectedFiles.length == 1 && data.id === 'Rename'){ 
            console.log('Rename');
        }

        if(data.state.selectedFiles.length > 0 && data.id === 'Delete'){
            console.log('Delete');
        }

        if(data.id === 'CreateFile'){
            console.log('CreateFile');
        } else if(data.id === 'create_folder'){
            console.log('CreateFolder');
        }
    }, []);

    useEffect(() => {
        ipcRenderer.on('Refresh_FM', (_) => {
            setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
        });
        return () => {
            ipcRenderer.removeAllListeners('Refresh_FM');
        };
    }, [])


    useEffect(() => {
        ReadDirectory(directoryPath).then(fetchedFiles => {
            if (Array.isArray(fetchedFiles)) {
                setFiles(fetchedFiles);
            } else {
                console.log("error reading directory");
            }
        });
    }, [directoryPath, refreshKey]);



    return (
        <div style={{ height: 500 }}>
            <FileBrowser
                files={files}
                folderChain={folderChain}
                fileActions={fileActions}
                onFileAction={handleFileAction}
                darkMode={true}
                disableDefaultFileActions={actionsToDisable}
            >
                <FileNavbar />
                <FileToolbar />
                <FileList />
                <FileContextMenu />
            </FileBrowser>
        </div>
    );
};

export default FileBrowsers;