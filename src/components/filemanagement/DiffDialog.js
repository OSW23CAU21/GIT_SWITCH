import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, createTheme, Button, ThemeProvider } from "@mui/material";
import { green, red } from '@mui/material/colors';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const DiffDialog = ({ open, handleClose, diffResult, filePath }) => {
    const lines = diffResult.split('\n');
    return (
        <ThemeProvider theme={darkTheme}>
            <Dialog open={open} onClose={handleClose} aria-labelledby="diff-dialog-title" maxWidth="md" fullWidth={true}>
                <DialogTitle id="diff-dialog-title">File Differences - {filePath}</DialogTitle>
                <DialogContent dividers>
                    <pre>
                        {lines.map((line, i) => {
                            let color;
                            if (line.startsWith('+')) {
                                color = green[500];
                            } else if (line.startsWith('-')) {
                                color = red[500];
                            } else {
                                color = 'inherit';
                            }
                            return (
                                <Typography key={i} style={{ color: color }}>
                                    {line}
                                </Typography>
                            );
                        })}
                    </pre>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

export default DiffDialog;
