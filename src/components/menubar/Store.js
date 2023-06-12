import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, InputAdornment, OutlinedInput, FormControl, InputLabel, Button } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/system';

const { ipcRenderer } = window.require('electron');


const saveTokens = async (tokens) => {
    const result = await ipcRenderer.invoke('SD_storetoken', tokens);
    return result;
}

const saveAuthor = async (name, email) => {
    const result = await ipcRenderer.invoke('SD_storeauthor', name, email);
    return result;
}

export const SettingsDialog = ({ open, handleClose }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [gitToken, setGitToken] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    const [showAccessToken, setShowAccessToken] = useState(false);

    useEffect(() => {
        async function getInfos() {
            const tokens = await ipcRenderer.invoke('SD_calltoken');
            setGitToken(tokens);
            const author = await ipcRenderer.invoke('SD_callauthor');
            setAuthorName(author.name);
            setAuthorEmail(author.email);
        }

        getInfos();
    }, [refreshKey]);

    useEffect(() => {
        ipcRenderer.on('Refresh_author', (_) => {
            setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
        });
        return () => {
            ipcRenderer.removeAllListeners('Refresh_author');
        };
    }, [])

    useEffect(() => {
        ipcRenderer.on('Refresh_token', (_) => {
            setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
        });
        return () => {
            ipcRenderer.removeAllListeners('Refresh_token');
        };
    }, [])

    const handleClickShowPassword = () => {
        setShowAccessToken(!showAccessToken);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSave = async () => {
        await saveAuthor(authorName, authorEmail);
        await saveTokens(gitToken);
        handleClose();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Settings</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Author Name"
                        fullWidth
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Author Email"
                        fullWidth
                        value={authorEmail}
                        onChange={(e) => setAuthorEmail(e.target.value)}
                    />
                    <FormControl variant="outlined" fullWidth margin="dense">
                        <InputLabel htmlFor="outlined-adornment-password">Personal Access Token</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showAccessToken ? 'text' : 'password'}
                            value={gitToken}
                            onChange={(e) => setGitToken(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showAccessToken ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Personal Access Token"
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
