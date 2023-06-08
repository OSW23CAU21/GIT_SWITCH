import { useState } from 'react';
import { Fab, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, List, ListItem } from '@mui/material';
import RefreshIcon from '@mui/icons-material/RefreshOutlined';
import {styled} from '@mui/system';

const StyledFab = styled(Fab)(({ theme }) => ({
    position: 'fixed', 
    bottom: theme.spacing(34), 
    right: theme.spacing(2), 
    color: '#0086FF',
    backgroundColor: '#FFFFFF', 
    '&:hover': {
      backgroundColor: '#FFFFFF', 
    },
  }));


const RefreshFab = () => {

    const buttonClick = () => {
        window.location.reload();
    }

    return (
        <div>
            <StyledFab aria-label="switch" onClick={buttonClick}>
                <RefreshIcon />
            </StyledFab>
        </div>
    );
}


export default RefreshFab;