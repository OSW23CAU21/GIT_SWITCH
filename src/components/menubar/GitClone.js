import { useState, useEffect } from 'react';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, InputAdornment, OutlinedInput, FormControl, InputLabel, Button } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/system';

const { ipcRenderer } = window.require('electron');


const saveTokens = async (tokens) => {
    const result = await ipcRenderer.invoke('SD_storetoken');
    return result;
}

const gitClone = async (url, tokens) => {
    const result = await ipcRenderer.invoke('GF_gitClone', url, tokens);
    return result;
}

export const GitCloneDialog = ({ open, handleClose }) => {
    const [loading, setLoading] = useState(false);
    const [gitUrl, setGitUrl] = useState('');
    const [gitToken, setGitToken] = useState('');
    const [showAccessToken, setShowAccessToken] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function getTokens() {
            const tokens = await ipcRenderer.invoke('SD_calltoken');
            setGitToken(tokens);
            return tokens;
        }

        getTokens();
    }, []);

    const handleClone = async () => {
        setLoading(true);
        await gitClone(gitUrl, gitToken);
        await saveTokens(gitToken);
        setLoading(false);
        handleClose();
        window.location.reload();
    };

    const handleClickShowPassword = () => {
        setShowAccessToken(!showAccessToken);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Git Clone</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="GitHub URL"
                        type="url"
                        fullWidth
                        value={gitUrl}
                        onChange={(e) => setGitUrl(e.target.value)}
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
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button onClick={handleClone} disabled={loading}>
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Clone"
                        )}</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};
