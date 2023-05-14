import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, List, ListItem } from '@mui/material';

const { ipcRenderer } = window.require('electron');

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

const Menubar = () => {
  const [open, setOpen] = useState(false);
  const [commitDialogOpen, setCommitDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [gitFileInfo, setGitFileInfo] = useState("null");



  const setDirButtonClick = async () => {
    const rootPath = await ipcRenderer.invoke('getRoot');
    console.log(rootPath);
  }

  const gitInitButtonClick = async () => {
    const gitInit = await ipcRenderer.invoke('gitInit');
    console.log('gitInit', gitInit);
    if (gitInit) {
      setMessage('Current Directory is already managed by git');
      setOpen(true);
    }
  }

  const commitButtonClick = async () => {
    const gitInfo = await ipcRenderer.invoke('gitCommitTry');
    console.log('gitInit : ', gitInfo);
    setGitFileInfo(gitInfo);
    setCommitDialogOpen(true);
  }

  const handleCommit = async () => {
    const commitMsg = commitMessage || 'undefined commit';
    const authorNme = authorName || 'undefined author';
    const authorEml = authorEmail || 'undefined@author.com';

    const gitInit = await ipcRenderer.invoke('gitCommitConfirm', commitMsg, authorNme, authorEml);
    setCommitDialogOpen(false);
  }

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{"Git Initialization Result"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={commitDialogOpen} onClose={() => setCommitDialogOpen(false)}>
        <DialogTitle>{"Commit Changes"}</DialogTitle>
        <DialogContent>
          <List>
            {Object.entries(gitFileInfo).map(([status, filePaths]) => (
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

      <Button onClick={setDirButtonClick}>SetDir</Button>
      <Button onClick={gitInitButtonClick}>GitInit</Button>
      <Button onClick={commitButtonClick}>Commit</Button>


    </div>
  );
};

export default Menubar;