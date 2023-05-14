import {useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, List, ListItem } from '@mui/material';

const {ipcRenderer} = window.require('electron');

const Menubar = () => {
  const [message, setMessage] = useState("");
  const [commitMessage, setCommitMessage] = useState("");

  return (
  <div>
    <button onClick = {setDirButtonClick}>setDir</button>
    <button onClick = {gitInitButtonClick}>gitInit</button>
    <button onClick = {commitButtonClick}>commit</button>
  </div>
  );
};

const setDirButtonClick = async () => {
  const rootPath = await ipcRenderer.invoke('getRoot');
  console.log(rootPath); 
}

const gitInitButtonClick = async () => {
  const gitInit = await ipcRenderer.invoke('gitInit'); 
  console.log('gitInit');
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



export default Menubar;