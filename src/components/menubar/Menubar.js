import { useState } from 'react';
import { buttonStyle, dialogStyle } from './Style';
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
    const rootPath = await ipcRenderer.invoke('MB_getRoot');
    console.log(rootPath);
  }

  const gitInitButtonClick = async () => {
    const gitInit = await ipcRenderer.invoke('MB_gitInit');
    console.log('gitInit', gitInit);
    if (gitInit) {
      setMessage('Current Directory is already managed by git');
      setOpen(true);
    }
  }

  const commitButtonClick = async () => {
    const gitInfo = await ipcRenderer.invoke('MB_gitCommitTry');
    console.log('gitInit : ', gitInfo);
    setGitFileInfo(gitInfo);
    setCommitDialogOpen(true);
  }

  const handleCommit = async () => {
    const commitMsg = commitMessage || 'undefined commit';
    const authorNme = authorName || 'undefined author';
    const authorEml = authorEmail || 'undefined@author.com';

    const gitInit = await ipcRenderer.invoke('MB_gitCommitConfirm', commitMsg, authorNme, authorEml);
    setCommitDialogOpen(false);
  }


  return (
    <div>
      <Button sx = {buttonStyle} onClick={setDirButtonClick}>SetDir</Button>
    </div>
  );
};

export default Menubar;