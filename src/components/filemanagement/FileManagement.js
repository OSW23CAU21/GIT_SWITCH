import React, { useState, useEffect, useCallback } from 'react';
import { Fab, useTheme } from "@mui/material"
import GitHubIcon from '@mui/icons-material/GitHub';
import AppleIcon from '@mui/icons-material/Apple';
import WorkSpaceBrowser from './WorkSpaceBrowser';
import GitBrowser from './GitSpaceBrowser';

const { ipcRenderer } = window.require('electron');

const ReadBaseName = async (DirectoryPath) => {
    try {
        const BaseName = await ipcRenderer.invoke('FM_getFolderChain', DirectoryPath);
        return BaseName;
    } catch {
        console.log('Error to read BaseName');
        return null;
    }
}

const ReadBranchName = async (rootPath) =>{
    try {
        const branchName = await ipcRenderer.invoke('GM_branchName', rootPath);
        return branchName;
    } catch {
        console.log('Error to read BranchName');
        return null;
    }
}

const FileManagement = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [directoryPath, setDirectoryPath] = useState('./');
    const [folderChain, setFolderChain] = useState([]);
    const [rootFlag, setRootFlag] = useState(false);

    useEffect(() => {
        ipcRenderer.on('RootPathChanged', (_, newRootPath) => {
            console.log('newPath allocated : ', newRootPath);
            setRootFlag(true);
            setDirectoryPath(newRootPath);
        });
        return () => {
            ipcRenderer.removeAllListeners('RootPathChanged');
        };
    }, []);


    useEffect(() => {
        ReadBaseName(directoryPath).then(fetchedName => {
            if (rootFlag) {
                setFolderChain([{ id: fetchedName[0], name: fetchedName[1], isDir: true }]);
                setRootFlag(false);
            }
            setFolderChain(prevFolderChain => {
                const isIndex = prevFolderChain.findIndex(item => item.id === fetchedName[0]);
                if (isIndex !== -1) {
                    return prevFolderChain.slice(0, isIndex + 1);
                } else {
                    return [...prevFolderChain, { id: fetchedName[0], name: fetchedName[1], isDir: true }];
                }
            });
        });
    }, [directoryPath]);


    const switchTabs = async () => {
        if(activeTab === 0){
            const branchName = await ReadBranchName(folderChain[0].id);
            setFolderChain(prevChain => {
                const newFolderChain = [...prevChain];  
                newFolderChain[0] = {...newFolderChain[0], name: branchName};
                return newFolderChain;  
            });
        } else {
            const baseName = await ReadBaseName(folderChain[0].id);
            setFolderChain(prevChain => {
                const newFolderChain = [...prevChain];  
                newFolderChain[0] = {...newFolderChain[0], name: baseName[1]};
                return newFolderChain; 
            });
        }
        setActiveTab((prev) => prev === 0 ? 1 : 0); 
    }

    const theme = useTheme(); 

    return (
        <div>
            {
                activeTab === 0 ?
                    <>
                        <WorkSpaceBrowser
                            directoryPath={directoryPath}
                            setDirectoryPath={setDirectoryPath}
                            folderChain={folderChain}
                        />
                        <Fab color="primary" aria-label="switch" onClick={switchTabs} style={{ position: 'fixed', bottom: theme.spacing(2), right: theme.spacing(2) }}>
                            <AppleIcon />
                        </Fab>
                    </> :
                    <>
                        <GitBrowser
                            directoryPath={directoryPath}
                            setDirectoryPath={setDirectoryPath}
                            folderChain={folderChain}
                        />
                        <Fab color="secondary" aria-label="switch" onClick={switchTabs} style={{ position: 'fixed', bottom: theme.spacing(2), right: theme.spacing(2) }}>
                            <GitHubIcon />
                        </Fab>
                    </>
            }
        </div>
    );
}

export default FileManagement;