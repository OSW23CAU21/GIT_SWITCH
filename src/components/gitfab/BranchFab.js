import { useState } from 'react';
import { Fab, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, List, ListItem } from '@mui/material';
import BranchIcon from '@mui/icons-material/SchemaRounded';
import {styled} from '@mui/system';
import React, {useEffect} from "react";

const {ipcRenderer} = window.require('electron');

const createBranch = async (rootPath, branchName) => {
    const beforeBranches = await ipcRenderer.invoke('list_branch', rootPath);
    const result = await ipcRenderer.invoke('create_branch', rootPath, branchName);
    const nextBranches = await ipcRenderer.invoke('list_branch', rootPath);

    console.log('branch list result', beforeBranches);
    console.log('result', result);
    console.log('branch list result', nextBranches);
}

const deleteBranch = async (rootPath, branchName) => {
    const beforeBranches = await ipcRenderer.invoke('list_branch', rootPath);
    const result = await ipcRenderer.invoke('delete_branch', rootPath, branchName);
    const nextBranches = await ipcRenderer.invoke('list_branch', rootPath);

    console.log('branch list result', beforeBranches);
    console.log('result', result);
    console.log('branch list result', nextBranches);
}

const renameBranch = async (rootPath, branchName, newBranchName) => {
    const beforeBranches = await ipcRenderer.invoke('list_branch', rootPath);
    const result = await ipcRenderer.invoke('rename_branch', rootPath, branchName, newBranchName);
    const nextBranches = await ipcRenderer.invoke('list_branch', rootPath);

    console.log('branch list result', beforeBranches);
    console.log('result', result);
    console.log('branch list result', nextBranches);
}

const checkoutBranch = async (rootPath, branchName) => {
    const result = await ipcRenderer.invoke('checkout_branch', rootPath, branchName);
    console.log('result', result);
}

const StyledFab = styled(Fab)(({ theme }) => ({
    position: 'fixed', 
    bottom: theme.spacing(18), 
    right: theme.spacing(2), 
    color: '#0086FF',
    backgroundColor: '#FFFFFF', 
    '&:hover': {
      backgroundColor: '#FFFFFF', 
    },
  }));

const BranchFab = () => {
    const [showButtons, setShowButtons] = useState(false);
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState(null);
    const [branchName, setBranchName] = useState('');
    const [newBranchName, setNewBranchName] = useState('');
    const [rootPath, setRootPath] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        ipcRenderer.on('RootPathChanged', (_, newRootPath) => {
            setRootPath(newRootPath);
        });
        return () => {
            ipcRenderer.removeAllListeners('RootPathChanged');
        };
    }, []);

    const buttonClick = () => {
        setShowButtons(!showButtons);
    };

    const handleButtonClick = (buttonAction) => {
        setOpen(true);
        setAction(buttonAction);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        // 여기에 각 기능에 대한 구현을 추가하세요.
        if(action === 'Create'){
            createBranch(rootPath, branchName)
            console.log(`Action: ${action}, Branch Name: ${branchName}`);
        } else if(action === 'Delete'){
            deleteBranch(rootPath, branchName)
            console.log(`Action: ${action}, Branch Name: ${branchName}`);
        } else if(action === 'Rename'){
            renameBranch(rootPath, branchName, newBranchName)
            console.log(`Action: ${action}, Branch Name: ${branchName}, New Branch Name: ${newBranchName}`);
        } else if(action === 'Checkout'){
            checkoutBranch(rootPath, branchName)
            console.log(`Action: ${action}, Branch Name: ${branchName}`);
        }

        handleClose();
    };

    return (
        <div>
            <StyledFab aria-label="switch" onClick={buttonClick}>
                <BranchIcon />
            </StyledFab>
            {showButtons && (
                <div>
                    <StyledFab
                        aria-label="create_button"
                        style={{ position: 'absolute', right: '260px', fontSize: '12px' }}
                        onClick={() => handleButtonClick('Create')}
                    >
                        Create
                    </StyledFab>
                    <StyledFab
                        aria-label="delete_button"
                        style={{ position: 'absolute', right: '200px', fontSize: '12px' }}
                        onClick={() => handleButtonClick('Delete')}
                    >
                        Delete
                    </StyledFab>
                    <StyledFab
                        aria-label="rename_button"
                        style={{ position: 'absolute', right: '140px', fontSize: '12px' }}
                        onClick={() => handleButtonClick('Rename')}
                    >
                        Rename
                    </StyledFab>
                    <StyledFab
                        aria-label="checkout_button"
                        style={{ position: 'absolute', right: '80px', fontSize: '12px' }}
                        onClick={() => handleButtonClick('Checkout')}
                    >
                        Check Out
                    </StyledFab>
                </div>
            )}
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{action} Branch</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the branch name.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Branch Name"
                        type="text"
                        fullWidth
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                    />
                    {action === 'Rename' && (
                        <TextField
                            margin="dense"
                            label="New Branch Name"
                            type="text"
                            fullWidth
                            value={newBranchName}
                            onChange={(e) => setNewBranchName(e.target.value)}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {action}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
export default BranchFab;