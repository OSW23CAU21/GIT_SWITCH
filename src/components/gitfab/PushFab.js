import { useState } from 'react';
import { Fab, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, List, ListItem } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {styled} from '@mui/system';

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


const PushFab = () => {

    const buttonClick = () => {
        console.log('fab push');
    }

    return (
        <div>
            <StyledFab aria-label="switch" onClick={buttonClick}>
                <CloudUploadIcon />
            </StyledFab>
        </div>
    );
}


export default PushFab;