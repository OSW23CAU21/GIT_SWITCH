import React, {useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

const {ipcRenderer} = window.require('electron');

function GitBranchDialog({ action }) {
    const [open, setOpen] = useState(false);
    const [branchName, setBranchName] = useState('');
    const [newBranchName, setNewBranchName] = useState('');

    const createBranch = async (branchName) => {
        const result = await ipcRenderer.invoke('create_branch', branchName);
        console.log('result', result);
    }

    const deleteBranch = async (branchName) => {
        const result = await ipcRenderer.invoke('delete_branch', branchName);
        console.log('result', result);
    }

    const renameBranch = async (branchName, newBranchName) => {
        const result = await ipcRenderer.invoke('rename_branch', branchName, newBranchName);
        console.log('result', result);
    }

    const checkoutBranch = async (branchName) => {
        const result = await ipcRenderer.invoke('checkout_branch', branchName);
        console.log('result', result);
    }


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        // 여기에 각 기능에 대한 구현을 추가하세요.
        if(action === 'Create'){
            createBranch(branchName)
            console.log(`Action: ${action}, Branch Name: ${branchName}`);
        } else if(action === 'Delete'){
            deleteBranch(branchName)
            console.log(`Action: ${action}, Branch Name: ${branchName}`);
        } else if(action === 'Rename'){
            renameBranch(branchName, newBranchName)
            console.log(`Action: ${action}, Branch Name: ${branchName}, New Branch Name: ${newBranchName}`);
        } else if(action === 'Checkout'){
            checkoutBranch(branchName)
            console.log(`Action: ${action}, Branch Name: ${branchName}`);
        }

        handleClose();
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                {action} Branch
            </Button>
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
}

export default GitBranchDialog;

//
// export default function App() {
//     return (
//         <div>
//             <GitBranchDialog action="Create" />
//             <GitBranchDialog action="Delete" />
//             <GitBranchDialog action="Rename" />
//             <GitBranchDialog action="Checkout" />
//         </div>
//     );
// }