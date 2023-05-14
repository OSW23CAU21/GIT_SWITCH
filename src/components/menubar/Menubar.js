import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, List, ListItem } from '@mui/material';

const { ipcRenderer } = window.require('electron');

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

      

      <Button onClick={setDirButtonClick}>Set Directory</Button>
      <Button onClick={gitInitButtonClick}>Git Init</Button>
      <Button onClick={commitButtonClick}>Commit</Button>
    </div>
  );
};

export default Menubar;
