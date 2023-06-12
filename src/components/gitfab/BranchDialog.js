import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Button, Box, Autocomplete, TextField } from "@mui/material";
import { styled } from '@mui/system';

const { ipcRenderer } = window.require('electron');

const LabelText = styled(DialogContentText)(({ theme }) => ({
    marginRight: theme.spacing(2),
}));


export const CreateBranchDialog = ({ open, handleClose, branchList, setAlertMessage, setAlertType, setAlertOpen }) => {
    const [newBranchName, setNewBranchName] = useState('');
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (!newBranchName || branchList.includes(newBranchName)) {
            setError("Invalid branch name or branch name already exists.");
            return;
        }
        const result = await ipcRenderer.invoke('BR_createbranch', newBranchName);
        if (result.result) {
            setAlertMessage(result.message);
            setNewBranchName(null);
            handleClose();
            setAlertType('success');
        } else {
            setAlertMessage(result.message.message);
            setAlertType('error');
        }
        setAlertOpen();

    }
    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"> Create Branch</DialogTitle>
                <Box display="flex" alignItems="center" p={3}>
                    <Box width="35%">
                        <LabelText>Create as:</LabelText>
                    </Box>
                    <Box width="60%">
                        <TextField
                            label="New Branch Name"
                            variant="outlined"
                            value={newBranchName}
                            error={!!error}
                            helperText={error}
                            onChange={(e) => setNewBranchName(e.target.value)}
                            fullWidth
                        />
                    </Box>
                </Box>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export const DeleteBranchDialog = ({ open, handleClose, branchList, setAlertMessage, setAlertType, setAlertOpen }) => {
    const [currentBranch, setCurrentBranch] = useState("");
    const [filteredBranchList, setFilteredBranchList] = useState([]);
    const [targetBranch, setTargetBranch] = useState("");


    useEffect(() => {
        async function fetchedBranchName() {
            const BranchName = await ipcRenderer.invoke('GF_branchname');
            setCurrentBranch(BranchName);
            const otherBranches = branchList.filter(branchName => branchName !== BranchName);
            setFilteredBranchList(otherBranches);
        }

        fetchedBranchName();
    }, [branchList]);

    const handleDelete = async () => {
        const result = await ipcRenderer.invoke('BR_deletebranch', targetBranch);
        if (result.result) {
            setAlertMessage(result.message);
            setTargetBranch(null);
            handleClose();
            setAlertType('success');
        } else {
            setAlertMessage(result.message.message);
            setAlertType('error');
        }
        setAlertOpen();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='sm'>
                <DialogTitle id="form-dialog-title"> Delete Branch </DialogTitle>
                <Box display="flex" alignItems="center" p={2}>
                    <LabelText>Target Branch:</LabelText>
                    <Autocomplete
                        id="branchlist"
                        options={filteredBranchList}
                        sx={{ width: 300 }}
                        onChange={(event, newValue) => {
                            setTargetBranch(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label={'Branch'} />}
                    />
                </Box>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export const RenameBranchDialog = ({ open, handleClose, branchList, setAlertMessage, setAlertType, setAlertOpen }) => {
    const [currentBranch, setCurrentBranch] = useState('');
    const [newBranchName, setNewBranchName] = useState('');
    const [targetBranch, setTargetBranch] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchedBranchName() {
            const BranchName = await ipcRenderer.invoke('GF_branchname');
            setCurrentBranch(BranchName);
        }

        fetchedBranchName();
    }, [branchList]);

    const checkOut = async (target) => {
        const result = await ipcRenderer.invoke('BR_checkout', target);
        return result;
    }

    const handleRename = async () => {
        if (!newBranchName || branchList.includes(newBranchName)) {
            setError("Invalid branch name or branch name already exists.");
            return;
        }

        const result = await ipcRenderer.invoke('BR_renamebranch', targetBranch, newBranchName);

        if (result.result) {
            let message = result.message;
            if (currentBranch === targetBranch) {
                message += ' The page will refresh in 3 seconds.';
            }
            setAlertMessage(message);
            setTargetBranch(null);
            setNewBranchName('');
            setError(null);
            handleClose();
            setAlertType('success');
        } else {
            setAlertMessage(result.message.message);
            setNewBranchName('');
            setError('Error occurs please check Alert!!');
            setAlertType('error');
        }

        if (currentBranch === targetBranch) {
            await checkOut(newBranchName);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
        setAlertOpen();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg">
                <DialogTitle id="form-dialog-title"> Rename Branch</DialogTitle>
                <Box display="flex" flexDirection="column" alignItems="stretch" p={2}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Box width="30%">
                            <LabelText>Target Branch:</LabelText>
                        </Box>
                        <Box width="70%">
                            <Autocomplete
                                id="branchlist"
                                options={branchList}
                                sx={{ width: '100%' }}
                                value={targetBranch}
                                onChange={(event, newValue) => {
                                    setTargetBranch(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label={'Branch'} fullWidth />}
                            />
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box width="30%">
                            <LabelText>Rename as:</LabelText>
                        </Box>
                        <Box width="70%">
                            <TextField
                                label="New Branch Name"
                                variant="outlined"
                                value={newBranchName}
                                error={!!error}
                                helperText={error}
                                onChange={(e) => setNewBranchName(e.target.value)}
                                fullWidth
                            />
                        </Box>
                    </Box>
                </Box>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleRename} color="primary">
                        Rename
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export const CheckoutDialog = ({ open, handleClose, branchList, setAlertMessage, setAlertType, setAlertOpen }) => {
    const [filteredBranchList, setFilteredBranchList] = useState([]);
    const [currentBranch, setCurrentBranch] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [targetBranch, setTargetBranch] = useState('');

    useEffect(() => {
        async function fetchedBranchName() {
            const BranchName = await ipcRenderer.invoke('GF_branchname');
            setCurrentBranch(BranchName);
            const otherBranches = branchList.filter(branchName => branchName !== BranchName);
            setFilteredBranchList(otherBranches);
        }

        fetchedBranchName();
    }, [branchList, refreshKey]);



    const handleCheckout = async () => {
        const result = await ipcRenderer.invoke('BR_checkout', targetBranch);
        if (result.result) {
            setAlertMessage(result.message + 'The page will refresh in 3 seconds');
            setTargetBranch(null);
            handleClose();
            setAlertType('success');
            setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else {
            setAlertMessage(result.message.message);
            setAlertType('error');
        }
        setAlertOpen();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg">
                <DialogTitle id="form-dialog-title"> CheckOut</DialogTitle>
                <Box display="flex" flexDirection="column" alignItems="stretch" p={2}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Box width="35%">
                            <LabelText>Current Branch:</LabelText>
                        </Box>
                        <Box width="65%">
                            <Box fontWeight="bold" color='#0052CC'>{currentBranch}</Box>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box width="30%">
                            <LabelText>Checkout To:</LabelText>
                        </Box>
                        <Box width="70%">
                            <Autocomplete
                                id="branchlist"
                                options={filteredBranchList}
                                sx={{ width: 300 }}
                                onChange={(event, newValue) => {
                                    setTargetBranch(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label={'Branch'} />}
                            />
                        </Box>
                    </Box>
                </Box>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCheckout} color="primary">
                        Checkout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};