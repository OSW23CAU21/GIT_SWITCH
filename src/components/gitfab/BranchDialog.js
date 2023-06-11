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
                <Box display="flex" alignItems="center" p ={3}>
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
    const [targetBranch, setTargetBranch] = useState("");

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
                        options={branchList}
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
    const [newBranchName, setNewBranchName] = useState('');
    const [targetBranch, setTargetBranch] = useState('');
    const [error, setError] = useState(null);

    const handleRename = async () => {
        if (!newBranchName || branchList.includes(newBranchName)) {
            setError("Invalid branch name or branch name already exists.");
            return;
        }

        const result = await ipcRenderer.invoke('BR_renamebranch', targetBranch, newBranchName);
        if (result.result) {
            setAlertMessage(result.message);
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
    const [currentBranch, setCurrentBranch] = useState('');
    const [targetBranch, setTargetBranch] = useState('');

    useEffect(() => {
        async function fetchedBranchName() {
            const BranchName = await ipcRenderer.invoke('GF_branchname');
            setCurrentBranch(BranchName);
        }

        fetchedBranchName();
    }, []);

    const handleCheckout = async () => {
        const result = await ipcRenderer.invoke('BR_checkout', targetBranch);
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
                                options={branchList}
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