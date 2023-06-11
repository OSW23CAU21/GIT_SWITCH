import { useState, useEffect } from 'react';
import { Fab, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, CircularProgress, Snackbar, Alert, Box } from '@mui/material';
import MergeIcon from '@mui/icons-material/MergeTypeOutlined';
import { Autocomplete } from '@mui/material';
import { styled } from '@mui/system';
const { ipcRenderer } = window.require("electron");

const StyledFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(26),
    right: theme.spacing(2),
    color: '#0086FF',
    backgroundColor: '#FFFFFF',
    '&:hover': {
        backgroundColor: '#FFFFFF',
    },
}));

const LabelText = styled(DialogContentText)(({ theme }) => ({
    marginRight: theme.spacing(2),
}));

const MergeFab = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentBranch, setCurrentBranch] = useState("");
    const [branches, setBranches] = useState([]);
    const [targetBranch, setTargetBranch] = useState("");
    const [isMerging, setIsMerging] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        Promise.all([ipcRenderer.invoke('GF_branchname'), ipcRenderer.invoke('GF_branchlist')]).then((results) => {
            const currentBranchName = results[0];
            setCurrentBranch(currentBranchName);
            const otherBranches = results[1].filter(branchName => branchName !== currentBranchName);
            setBranches(otherBranches);
        });
    }, [refreshKey]);

    useEffect(() => {
        ipcRenderer.on('Refresh_BranchList', (_) => {
            setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
        });
        return () => {
            ipcRenderer.removeAllListeners('Refresh_BranchList');
        };
    }, [])

    const handleMerge = async () => {
        setIsMerging(true);
        const result = await ipcRenderer.invoke('GF_mergebranch', currentBranch, targetBranch);
        setIsMerging(false);
        setSnackbarMessage(result.message);
        if(result.result){
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setDialogOpen(false);
        }else{
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <div>
            <StyledFab aria-label="switch" onClick={() => setDialogOpen(true)}>
                <MergeIcon />
            </StyledFab>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth={false} maxWidth='md'>
                <DialogTitle>Merge Branches</DialogTitle>
                <DialogContent>
                    <Box display="flex" alignItems="center" marginBottom="1em">
                        <LabelText>Current Branch:</LabelText>
                        <Box fontWeight="bold" color='#0052CC'>{currentBranch}</Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <LabelText>Target Branch:</LabelText>
                        <Autocomplete
                            id="branchlist"
                            options={branches}
                            sx={{ width: 300 }}
                            onChange={(event, newValue) => {
                                if(newValue == null) return;
                                setTargetBranch(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label = {'Branch'}/>}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                    <Button onClick={handleMerge} disabled={isMerging}>
                        {isMerging ? <CircularProgress /> : "Merge"}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default MergeFab;

