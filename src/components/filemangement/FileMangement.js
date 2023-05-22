import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox, TextField } from '@mui/material';
import './file-explorer/file-explorer.css';
const { ipcRenderer } = window.require('electron');

const getDirInfo = async (dirPath, callback) => {
  try {
    const result = await ipcRenderer.invoke('ReadDir', dirPath);
    callback(result);
  } catch (err) {
    console.error('Error reading directory info:', err);
  }
};

const putOpenFile = async (filePath) => {
  try {
    const result = await ipcRenderer.invoke('OpenFile', filePath);
  } catch (err) {
    console.error('Error opening Files:', err);
  }
};


function OpenFile() {
  const [fileInfo, setFileInfo] = useState(null);
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [newName, getNewName] = useState('');
  const [selected, getSelected] = useState({
    Rename: false,
    Delete: false,
    Untrack: false,
    Restore: false
  });

  const handleExecute = async (callback) => {
    const actions = Object.keys(selected).filter((key) => selected[key]);

    actions.forEach((action) => {
      ipcRenderer.invoke('executeAction', { action, newName: action === 'Rename' ? newName : undefined, fileInfo });
    });

    handleClose();
  }

  useEffect(() => {
    const handleOpeningFiles = (_, fileEntry) => {
      setFileInfo(fileEntry);
      if (fileEntry.Open) {
        setOpen(true);
      } else {
        setOpenError(true);
      }
    };

    ipcRenderer.on('openingFiles', handleOpeningFiles);

    return () => {
      ipcRenderer.removeListener('openingFiles', handleOpeningFiles);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setOpenError(false);
  };

  const handleNewNameChange = (event) => {
    getNewName(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    getSelected({ ...selected, [event.target.name]: event.target.checked });
    getSelected({
      Rename: false,
      Delete: false,
      Untrack: false,
      Restore: false,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Git Management</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'left', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel control={<Checkbox checked={selected.Rename} onChange={handleCheckboxChange} name="Rename" />} label="Rename" />
              <TextField id="rename-input" label="New Name" value={newName} onChange={handleNewNameChange} />
            </div>
            <FormControlLabel control={<Checkbox checked={selected.Delete} onChange={handleCheckboxChange} name="Delete" />} label="Delete" />
            <FormControlLabel control={<Checkbox checked={selected.Untrack} onChange={handleCheckboxChange} name="Untrack" />} label="Untrack" />
            <FormControlLabel control={<Checkbox checked={selected.Restore} onChange={handleCheckboxChange} name="Restore" />} label="Restore" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleExecute} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openError} onClose={handleClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          This file is not managed by git.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function FileMangement() {
  const id = 'filemanager'; // getting id when components change to Filemangement(id) to feature support "switching"

  useEffect(() => {
    ipcRenderer.on('RootNameChanged', (_, newRootName) => {
      window.location.reload();
    });
    return () => {
      ipcRenderer.removeAllListeners('RootPathChanged');
    };
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = './file-explorer/file-explorer.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const elem = document.getElementById(id);
      //console.log(RootPath);
      const options = {
        initpath: [['', 'Base', { canmodify: false }]],
        onrefresh: function (folder, required) {
          const PathArr = folder.GetPath().at(-1);
          var dirPath = PathArr[0]
          //console.log('pathARR : ', PathArr);
          //console.log('dirPath : ', dirPath);
          getDirInfo(dirPath, (contents) => {
            folder.SetEntries(contents);
          });
        },
        onopenfile: function (folder, entry) {
          putOpenFile(entry);
          console.log('openingFiles: ', entry.name);
        },
      };
      const fe = new window.FileExplorer(elem, options);
      fe.removeEventListener();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  return (
    <>
      <div
        id={id}
        style={{
          height: '50vh',
          maxHeight: '400px',
          position: 'relative',
        }}
      ></div>
      <OpenFile />
    </>
  );
}

export default FileMangement;
