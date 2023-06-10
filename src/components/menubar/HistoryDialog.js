import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import GitCommitHistory from './CommitHistory';  // Assuming you have this import

function HistoryDialog({ open, handleClose }) {
    const [currentBranchName, setCurrentBranchName] = useState('');
    const [infoOpen, setInfoOpen] = useState(false);
    const [commitInfo, setCommitInfo] = useState('');

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
                    Commit History
                    <IconButton aria-label="close" onClick={handleClose} style={{ position: 'absolute', right: '8px', top: '8px' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <GitCommitHistory infoOpen={alertOpen} infoClose={alertClose} setCommitInfo={setCommitInfo} />
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
