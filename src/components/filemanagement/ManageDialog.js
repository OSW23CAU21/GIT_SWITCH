import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from "@mui/material";

export const RenameDialog = ({ open, handleClose, handleRename, oldName }) => {
  const [newName, setNewName] = useState(oldName);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (open) {
      setNewName(oldName);
      setError(false);
    }
  }, [open, oldName]);

  const handleSubmit = () => {
    if (newName.trim() === '') {
      setError(true);
    } else {
      handleRename(newName);
      handleClose();
    }
  };

  const handleChange = (e) => {
    setNewName(e.target.value);
    setError(e.target.value.trim() === '');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Rename</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="New Name"
          type="text"
          fullWidth
          value={newName}
          error={error}
          helperText={error ? 'File name cannot be empty' : ''}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Rename</Button>
      </DialogActions>
    </Dialog>
  );
};

export const DeleteDialog = ({ open, handleClose, handleDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Confirm Deletion"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete these items?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          style={{ color : 'red'}}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const RestoreDialog = ({ open, handleClose, handleDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Confirm Restoration"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to restore these items?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          style={{ color : 'blue'}}
          autoFocus
        >
          Restore
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const UntrackDialog = ({ open, handleClose, handleDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Confirm Untracking"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to untrack these items?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          style={{ color : '#bd1e3e'}}
          autoFocus
        >
          Untrack
        </Button>
      </DialogActions>
    </Dialog>
  );
};