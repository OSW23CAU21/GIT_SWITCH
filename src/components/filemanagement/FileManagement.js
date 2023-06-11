import React, { useState, useEffect } from 'react';
import { Fab, CircularProgress, Snackbar, Alert } from "@mui/material"
import { styled } from '@mui/system';
import GitHubIcon from '@mui/icons-material/GitHub';
import AppleIcon from '@mui/icons-material/Apple';
import InitIcon from '@mui/icons-material/Add';
import WorkSpaceBrowser from './WorkSpaceBrowser';
import GitBrowser from './GitSpaceBrowser';

const { ipcRenderer } = window.require('electron');



const StyledOSFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    color: '#666666',
    backgroundColor: '#FFFFFF',
    '&:hover': {
        backgroundColor: '#64BDFF',
    },
}));

const StyledGitFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    color: '#FFFFFF',
    backgroundColor: '#666666',
    '&:hover': {
        backgroundColor: '#64BDFF',
    },
}));

const StyledInitFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    color: '#FFFFFF',
    backgroundColor: '#666666',
    '&:hover': {
        backgroundColor: '#64BDFF',
    },
}));


const ReadBaseName = async (DirectoryPath) => {
    try {
        const BaseName = await ipcRenderer.invoke('FM_getFolderChain', DirectoryPath);
        return BaseName;
    } catch {
        console.log('Error to read BaseName');
        return null;
    }
}

const ReadBranchName = async (rootPath) => {
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
    const [directoryPath, setDirectoryPath] = useState('');
    const [folderChain, setFolderChain] = useState([]);
    const [resultMessage, setResultMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [needInit, setNeedInit] = useState(false);
    const [rootFlag, setRootFlag] = useState(false);

    useEffect(() => {
        ipcRenderer.on('RootPathChanged', (_, newRootPath) => {
            setRootFlag(true);
            setDirectoryPath(newRootPath);
        });
        return () => {
            ipcRenderer.removeAllListeners('RootPathChanged');
        };
    }, []);

    useEffect(() => {
        ipcRenderer.on('Refresh_branchname', (_, newBranchName) => {
            if (activeTab !== 0) {
                setFolderChain(prevChain => {
                    const newFolderChain = [...prevChain];
                    newFolderChain[0] = { ...newFolderChain[0], name: newBranchName };
                    return newFolderChain;
                });
            }
        });
        return () => {
            ipcRenderer.removeAllListeners('Refresh_branchname');
        };
    }, [activeTab])

    useEffect(() => {
        async function fetchBasePath() {
            const basePath = await ipcRenderer.invoke('SD_callpath');
            setRootFlag(true);
            setDirectoryPath(basePath);
        }
        async function checkInit() {
            const result = await ipcRenderer.invoke('GF_checkinit');
            setNeedInit(!result);
        }

        fetchBasePath();
        checkInit();
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
        if (activeTab === 0) {
            const branchName = await ReadBranchName(folderChain[0].id);
            setFolderChain(prevChain => {
                const newFolderChain = [...prevChain];
                newFolderChain[0] = { ...newFolderChain[0], name: branchName };
                return newFolderChain;
            });
        } else {
            const baseName = await ReadBaseName(folderChain[0].id);
            setFolderChain(prevChain => {
                const newFolderChain = [...prevChain];
                newFolderChain[0] = { ...newFolderChain[0], name: baseName[1] };
                return newFolderChain;
            });
        }
        setActiveTab((prev) => prev === 0 ? 1 : 0);
    }

    const gitInit = async () => {
        const result = await ipcRenderer.invoke('GF_gitinit');
        setIsLoading(true);
        if (result.result) {
            setMessageType('success');
            setResultMessage(result.message);
            setIsLoading(false);
            setNeedInit(false);
        } else {
            setMessageType('error');
            setResultMessage(result.message.message);
            setIsLoading(false);
        }
        setOpenAlert(true);
    }

    return (
        <div>
            <div>
                {
                    activeTab === 0 ?
                        <>
                            <WorkSpaceBrowser
                                directoryPath={directoryPath}
                                setDirectoryPath={setDirectoryPath}
                                folderChain={folderChain}
                            />
                            <StyledOSFab aria-label="switch" onClick={switchTabs} >
                                <AppleIcon />
                            </StyledOSFab>
                        </> :
                        <>
                            <GitBrowser
                                directoryPath={directoryPath}
                                setDirectoryPath={setDirectoryPath}
                                folderChain={folderChain}
                            />
                            <StyledGitFab aria-label="switch" onClick={switchTabs} >
                                <GitHubIcon />
                            </StyledGitFab>
                        </>
                }
            </div>
            {needInit && (
                <div>
                    <StyledInitFab aria-label="switch" onClick={gitInit} >
                        {isLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <InitIcon />
                        )}
                    </StyledInitFab>
                    <Snackbar
                        open={openAlert}
                        autoHideDuration={6000}
                        onClose={() => setOpenAlert(false)}
                    >
                        <Alert onClose={() => setOpenAlert(false)} severity={messageType} variant="filled">
                            {resultMessage}
                        </Alert>
                    </Snackbar>
                </div>
            )}
        </div>
    );
}
export default FileManagement;