import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, TextField, Snackbar, Alert, Autocomplete, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import GitCommitHistory from './CommitHistory';  // Assuming you have this import

const { ipcRenderer } = window.require('electron');

function HistoryDialog({ open, handleClose }) {
    const [commits, setCommits] = useState(null);
    const [infoOpen, setInfoOpen] = useState(false);
    const [commitInfo, setCommitInfo] = useState('');
    const [currentBranch, setCurrentBranch] = useState("");

    useEffect(async() => {
        const branchName = await ipcRenderer.invoke('GF_branchname');
        setCurrentBranch(branchName);
        const commitList = await ipcRenderer.invoke('GH_gethistory', branchName);
        setCommits(commitList);
    }, []);


    const alertOpen = () => {
        setInfoOpen(true);
    }

    const alertClose = () => {
        setInfoOpen(false);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle>
                    Commit History - {currentBranch}
                    <IconButton aria-label="close" onClick={handleClose} style={{ position: 'absolute', right: '8px', top: '8px' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <GitCommitHistory commits={commits} infoOpen={alertOpen} infoClose={alertClose} setCommitInfo={setCommitInfo} />
                </DialogContent>
            </Dialog>
            <Snackbar open={infoOpen} autoHideDuration={6000} onClose={alertClose}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                    {commitInfo}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default HistoryDialog;
