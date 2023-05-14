import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, List, ListItem } from '@mui/material';
import { GoGitCommit, GoFoldUp, GoFileDirectory } from 'react-icons/go';

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

      <Dialog open={commitDialogOpen} onClose={() => setCommitDialogOpen(false)}>
        <DialogTitle>{"Commit Changes"}</DialogTitle>
        <DialogContent>
          {gitFileInfo && (
            <List>
              {Object.entries(gitFileInfo).map(([key, fileInfo]) => {
                // Only return a ListItem for staged files
                if (!fileInfo.staged) {
                  return (
                    <ListItem key={key}>
                      {fileInfo.name}
                    </ListItem>
                  );
                }
                // In case you want to not render anything for staged files, return null
                return null;
              })}
            </List>
          )}
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

      <button onClick={setDirButtonClick}>
        <GoFileDirectory size={20} />
        Set Directory
      </button>
      <button onClick={gitInitButtonClick}>
        <GoFoldUp size={20} />
        Git Init
      </button>
      <button onClick={commitButtonClick}>
        <GoGitCommit size={20} />
        Commit
      </button>

    </div>
  );
};

export default Menubar;
