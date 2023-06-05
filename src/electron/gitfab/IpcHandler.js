const { ipcMain } = require('electron');
const { commitStatus, gitCommit } = require('./functions');

ipcMain.handle('GF_gitCommitTry', async (event) => {
    return await commitStatus('./');
});


ipcMain.handle('GF_gitCommitConfirm', async (event, commitMessage, authorName, authorEmail) => {
    await gitCommit(commitMessage, authorName, authorEmail);
    sendRootChanged(RootPath);
});