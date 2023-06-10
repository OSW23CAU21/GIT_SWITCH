import { useState } from 'react';
import { Fab, Snackbar, Alert, Slide } from '@mui/material';
import BranchIcon from '@mui/icons-material/AltRoute';
import { styled } from '@mui/system';
import React, { useEffect } from "react";
import CreateIcon from '@mui/icons-material/AddLocationRounded';
import DeleteIcon from '@mui/icons-material/LocationOffRounded';
import CheckoutIcon from '@mui/icons-material/PublishedWithChangesSharp';
import RenameIcon from '@mui/icons-material/EditLocationAltRounded';

import { RenameBranchDialog, CreateBranchDialog, DeleteBranchDialog, CheckoutDialog } from './BranchDialog';

const { ipcRenderer } = window.require('electron');

const CreateFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(34),
    right: theme.spacing(2),
    color: '#FFFFFF',
    backgroundColor: '#666666',
    '&:hover': {
        backgroundColor: '#64BDFF',
    },
}));

const DeleteFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(26),
    right: theme.spacing(2),
    color: '#FFFFFF',
    backgroundColor: '#666666',
    '&:hover': {
        backgroundColor: '#64BDFF',
    },
}));

const RenameFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(10),
    right: theme.spacing(2),
    color: '#FFFFFF',
    backgroundColor: '#666666',
    '&:hover': {
        backgroundColor: '#64BDFF',
    },
}));

const CheckoutFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    color: '#FFFFFF',
    backgroundColor: '#666666',
    '&:hover': {
        backgroundColor: '#64BDFF',
    },
}));

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
    const [openCreate, setOpenCreate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openRename, setOpenRename] = useState(false);
    const [openCheckout, setOpenCheckout] = useState(false);
    const [clickBranchFab, setClickBranchFab] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [alertOpen, setAlertOpen] = useState(false);
    const [branchList, setBranchList] = useState([]);

    useEffect(() => {
        async function fetchedBranchList() {
            const Branchs = await ipcRenderer.invoke('GF_branchlist');
            setBranchList(Branchs);
        }

        fetchedBranchList();
    }, []);

    const branchBtnClick = () => {
        if (clickBranchFab) {
            setClickBranchFab(false);
        } else {
            setClickBranchFab(true);
        }
    }


    return (
        <div>
            <div>
                <StyledFab aria-label="switch" onClick={() => { branchBtnClick() }}>
                    <BranchIcon />
                </StyledFab>
                <Slide direction="up" in={clickBranchFab} mountOnEnter unmountOnExit>
                    <CreateFab
                        aria-label="create_button"
                        onClick={() => { setOpenCreate(true) }}
                    >
                        <CreateIcon />
                    </CreateFab>
                </Slide>
                <Slide direction="up" in={clickBranchFab} mountOnEnter unmountOnExit>
                    <DeleteFab
                        aria-label="delete_button"
                        onClick={() => { setOpenDelete(true) }}
                    >
                        <DeleteIcon />
                    </DeleteFab>
                </Slide>
                <Slide direction="up" in={clickBranchFab} mountOnEnter unmountOnExit>
                    <RenameFab
                        aria-label="rename_button"
                        onClick={() => { setOpenRename(true) }}
                    >
                        <RenameIcon />
                    </RenameFab>
                </Slide>
                <Slide direction="up" in={clickBranchFab} mountOnEnter unmountOnExit>
                    <CheckoutFab
                        aria-label="checkout_button"
                        onClick={() => { setOpenCheckout(true) }}
                    >
                        <CheckoutIcon />
                    </CheckoutFab>
                </Slide>
            </div>
            <div>
                <CreateBranchDialog
                    open={openCreate}
                    handleClose={() => { setOpenCreate(false) }}
                    branchList={branchList}
                    setAlertMessage={setAlertMessage}
                    setAlertType={setAlertType}
                    setAlertOpen={() => { setAlertOpen(true) }}
                />
                <RenameBranchDialog
                    open={openRename}
                    handleClose={() => { setOpenRename(false) }}
                    branchList={branchList}
                    setAlertMessage={setAlertMessage}
                    setAlertType={setAlertType}
                    setAlertOpen={() => { setAlertOpen(true) }}
                />
                <CheckoutDialog
                    open={openCheckout}
                    handleClose={() => { setOpenCheckout(false) }}
                    branchList={branchList}
                    setAlertMessage={setAlertMessage}
                    setAlertType={setAlertType}
                    setAlertOpen={() => { setAlertOpen(true) }}
                />
                <DeleteBranchDialog
                    open={openDelete}
                    handleClose={() => { setOpenDelete(false) }}
                    branchList={branchList}
                    setAlertMessage={setAlertMessage}
                    setAlertType={setAlertType}
                    setAlertOpen={() => { setAlertOpen(true) }}
                />
            </div >
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={() => setAlertOpen(false)}
            >
                <Alert onClose={() => setAlertOpen(false)} severity={alertType} variant="filled">
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};
export default BranchFab;