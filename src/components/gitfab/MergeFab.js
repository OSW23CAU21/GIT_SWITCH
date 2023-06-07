import { useState } from 'react';
import { Fab, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, List, ListItem } from '@mui/material';
import MergeIcon from '@mui/icons-material/MergeTypeOutlined';
import {styled} from '@mui/system';

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

const MergeFab = () => {
    
    const buttonClick = () => {
        console.log('fab pull');
    }
 
    return (
        <div>
            <StyledFab aria-label="switch" onClick={buttonClick}>
                <MergeIcon />
            </StyledFab>
        </div>
    );
}

export default MergeFab;