// Todo.
// Git merge 완성하기. 
// alert 달기. 
// work space 완성하기.


import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import { GitCloneDialog } from './GitClone';
import { SettingsDialog } from './Store';
import HistoryDialog from './HistoryDialog';

const { ipcRenderer } = window.require('electron');

const theme = createTheme({
  components: {
    MuiToolbar: {
      variants: [
        {
          props: { variant: 'dense' },
          style: {
            minHeight: '48px',
            WebkitAppRegion: 'drag',
          },
        },
      ],
    },
    MuiButton: {
      styleOverrides: {
        root: {
          height: '30px',
          padding: '6px 10px',
          fontSize: '0.8rem',
          WebkitAppRegion: 'no-drag',
        },
      },
    },
  },
});

const Menubar = () => {
  const [openGitClone, setOpenGitClone] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  const setDirButtonClick = async () => {
    const rootPath = await ipcRenderer.invoke('MB_getRoot');
    await ipcRenderer.invoke('SD_storepath', rootPath);
    window.location.reload();
  }

  const gitCloneButtonClick = async () => {
    setOpenGitClone(true);
  }

  const SettingsButtonClick = async () => {
    setOpenSettings(true);
  }

  const HistoryButtonClick  = async () => {
    setOpenHistory(true);
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Box sx={{ marginLeft: 'auto' }}>
              <ButtonGroup variant="outlined" color="inherit" aria-label="outlined button group">
                <Button startIcon={<FolderOpenIcon />} onClick={setDirButtonClick}>
                  Set Directory
                </Button>

                <Button startIcon={<AddIcon />} onClick={gitCloneButtonClick}>
                  Git Clone
                </Button>

                <Button startIcon={<HistoryIcon />} onClick={HistoryButtonClick} style={{ paddingRight: 0 }} />
                <Button startIcon={<SettingsIcon />} onClick={SettingsButtonClick} style={{ paddingRight: 0 }} />
              </ButtonGroup>
            </Box>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <GitCloneDialog
        open={openGitClone}
        handleClose={() => setOpenGitClone(false)} />
      <SettingsDialog
        open={openSettings}
        handleClose={() => setOpenSettings(false)} />
      <HistoryDialog
        open={openHistory}
        handleClose={() => setOpenHistory(false)} />
    </div>
  );
};

export default Menubar;