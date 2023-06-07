import React, { useState, useEffect, useCallback } from 'react';
import { FileNavbar, FileToolbar, FileList, FileContextMenu, FileBrowser, ChonkyActions, defineFileAction, ChonkyIconName } from "chonky";
import { RenameDialog, DeleteDialog, RestoreDialog, UntrackDialog } from './ManageDialog';
import DiffDialog from './DiffDialog';

const { ipcRenderer } = window.require('electron');

const actionsToDisable = [
    ChonkyActions.ToggleHiddenFiles.id,
    ChonkyActions.SortFilesByDate.id,
    ChonkyActions.SortFilesBySize.id,
    ChonkyActions.OpenSelection.id,
    ChonkyActions.SelectAllFiles.id,
    ChonkyActions.ClearSelection.id,
];

const checkDirectoryExist = (selectedFiles) => {
    const searchedResult = selectedFiles.find(entry => entry.isDir === true);

    if (searchedResult === undefined) return true;
    else return false;
}

const readGitStatus = async (RootPath, DirectoryPath) => {
    try {
        const files = await ipcRenderer.invoke('GM_readGit', RootPath, DirectoryPath);
        return files;
    } catch {
        console.log('Error! chonkDir');
        return [];
    }
};

const GitBrowser = ({ directoryPath, setDirectoryPath, folderChain }) => {
    const [files, setFiles] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [untrackDialogOpen, setUntrackDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [diffDialogOpen, setDiffDialogOpen] = useState(false);
    const [diffResult, setDiffResult] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);

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
        id: 'GitRename',
        button: {
            name: 'Rename',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.clearSelection,
        },
    });

    const Delete = defineFileAction({
        id: 'GitDelete',
        button: {
            name: 'Delete',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.trash,
        },
    });

    const Restore = defineFileAction({
        id: 'GitRestore',
        button: {
            name: 'Restore',
            toolbar: false,
            contextMenu: true,
            icon: ChonkyIconName.loading,
        },
    });

    const ToStaged = defineFileAction({
        id: 'to_Staged',
        button: {
            name: 'To Staged',
            toolbar: true,
            contextMenu: false,
            icon: ChonkyIconName.upload,
        },
    });

    const ToUnStaged = defineFileAction({
        id: 'to_unstaged',
        button: {
            name: 'To Unstaged',
            toolbar: true,
            contextMenu: false,
            icon: ChonkyIconName.download,
        },
    });

    const fileActions = [Untrack, Rename, Delete, Restore, ToStaged, ToUnStaged];

    useEffect(() => {
        ipcRenderer.on('Refresh_GM', (_) => {
            setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
        });
        return () => {
            ipcRenderer.removeAllListeners('Refresh_GM');
        };
    }, [])

    useEffect(() => {
        readGitStatus(folderChain[0].id, directoryPath).then(fetchedFiles => {
            if (Array.isArray(fetchedFiles)) {
                setFiles(fetchedFiles);
            } else {
                console.log("error reading directory");
            }
        });
    }, [directoryPath, refreshKey]);

    const handleOpen = async (targetId) => {
        let result = await ipcRenderer.invoke('GD_readDiff', folderChain[0].id, targetId);
        setDiffResult(result);
        setSelectedFiles(targetId);
        console.log(result);
        setDiffDialogOpen(true);
      }
      

    const handleGitFileAction = useCallback((data) => {
        if (data.id === ChonkyActions.OpenFiles.id) {
            if (data.payload.files && data.payload.files.length !== 1) return;
            //if (!data.payload.targetFile) return;
            if (data.payload.targetFile.isDir) {
                setDirectoryPath(data.payload.targetFile.id);
            } else {
                handleOpen(data.payload.targetFile.id);
            }
        }
        if (data.state.selectedFiles.length == 1 && !data.state.selectedFiles[0].isDir) {// means selected file exist & is not directory.
            if (data.id === 'GitRename') {
                setSelectedFiles(data.state.selectedFiles);
                setRenameDialogOpen(true);
            }
        }

        if (data.state.selectedFiles.length > 0 && checkDirectoryExist(data.state.selectedFiles)) {
            if (data.id === 'GitRestore') {
                setSelectedFiles(data.state.selectedFiles);
                setRestoreDialogOpen(true);
            } else if (data.id === 'GitDelete') {
                setSelectedFiles(data.state.selectedFiles);
                setDeleteDialogOpen(true);
            } else if (data.id === 'Untrack') {
                setSelectedFiles(data.state.selectedFiles);
                setUntrackDialogOpen(true);
            }
        }
    }, []);



    return (
        <div style={{ height: 500 }}>
            <FileBrowser
                files={files}
                folderChain={folderChain}
                fileActions={fileActions}
                onFileAction={handleGitFileAction}
                disableDefaultFileActions={actionsToDisable}
            >
                <FileNavbar />
                <FileToolbar />
                <FileList />
                <FileContextMenu />
            </FileBrowser>
            <RenameDialog
                open={renameDialogOpen}
                handleClose={() => setRenameDialogOpen(false)}
                handleRename={(newName) => {
                    ipcRenderer.invoke('GM_GitRename', folderChain[0].id, selectedFiles, newName);
                    setRenameDialogOpen(false);
                }}
                oldName={selectedFiles.length > 0 ? selectedFiles[0].name : ''}
            />
            <DeleteDialog
                open={deleteDialogOpen}
                handleClose={() => setDeleteDialogOpen(false)}
                handleDelete={() => {
                    ipcRenderer.invoke('GM_GitDelete', folderChain[0].id, selectedFiles);
                    setDeleteDialogOpen(false);
                }}
            />
            <RestoreDialog
                open={restoreDialogOpen}
                handleClose={() => setRestoreDialogOpen(false)}
                handleDelete={() => {
                    ipcRenderer.invoke('GM_GitRestore', folderChain[0].id, selectedFiles);
                    setRestoreDialogOpen(false);
                }}
            />
            <UntrackDialog
                open={untrackDialogOpen}
                handleClose={() => setUntrackDialogOpen(false)}
                handleDelete={() => {
                    ipcRenderer.invoke('GM_GitUntrack', folderChain[0].id, selectedFiles);
                    setUntrackDialogOpen(false);
                }}
            />
            <DiffDialog
                open={diffDialogOpen}
                handleClose={() => setDiffDialogOpen(false)}
                diffResult={diffResult}
                filePath={selectedFiles}
            />
        </div>
    );
};

export default GitBrowser;