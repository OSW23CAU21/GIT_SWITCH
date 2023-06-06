import { useState } from 'react';
import { Fab, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, List, ListItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {styled} from '@mui/system';

const { ipcRenderer } = window.require('electron');

const StyledFab = styled(Fab)(({ theme }) => ({
    position: 'fixed', 
    bottom: theme.spacing(10), 
    right: theme.spacing(2), 
    color: '#0086FF',
    backgroundColor: '#FFFFFF', 
    '&:hover': {
      backgroundColor: '#FFFFFF', 
    },
  }));

const FileStatusList = ({status, filePaths}) => {
    return (
      <div>
        <h3>{status.toUpperCase()}</h3>
        {filePaths.map((filePath, index) => (
          <ListItem key={index}>
            {filePath}
          </ListItem>
        ))}
      </div>
    );
};

const CommitFab = (rootPath) => {
    const [commitDialogOpen, setCommitDialogOpen] = useState(false);
    const [commitMessage, setCommitMessage] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [authorEmail, setAuthorEmail] = useState("");
    const [commitStatus, setcommitStatus] = useState("null");

    const commitButtonClick = async () => {
        const gitInfo = await ipcRenderer.invoke('GF_gitCommitTry');
        setcommitStatus(gitInfo);
        setCommitDialogOpen(true);
    }


    const handleCommit = async () => {
        const commitMsg = commitMessage || 'undefined commit';
        const authorNme = authorName || 'undefined author';
        const authorEml = authorEmail || 'undefined@author.com';

        await ipcRenderer.invoke('GF_gitCommitConfirm', rootPath, commitMsg, authorNme, authorEml);
        setCommitDialogOpen(false);
    }

    return (
        <div>
            <Dialog open={commitDialogOpen} onClose={() => setCommitDialogOpen(false)}>
                <DialogTitle>{"Commit Changes"}</DialogTitle>
                <DialogContent>
                    <List>
                        {Object.entries(commitStatus).map(([status, filePaths]) => (
                            <FileStatusList key={status} status={status} filePaths={filePaths} />
                        ))}
                    </List>
                    <TextField autoFocus margin="dense" label="Commit Message" type="text" fullWidth variant="outlined" value={commitMessage} onChange={(e) => setCommitMessage(e.target.value)} />
                    <TextField margin="dense" label="Author Name" type="text" fullWidth variant="outlined" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
                    <TextField margin="dense" label="Author Email" type="text" fullWidth variant="outlined" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCommitDialogOpen(false)}>
                        Close
                    </Button>
                    <Button onClick={handleCommit}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <StyledFab aria-label="switch" onClick={commitButtonClick}>
                <CheckCircleIcon />
            </StyledFab>
        </div>
    );

}

export default CommitFab;