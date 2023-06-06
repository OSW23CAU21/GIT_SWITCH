const { ipcMain } = require('electron');
const { commitStatus, gitCommit } = require('./functions');

ipcMain.handle('GF_gitCommitTry', async (event) => {
    return await commitStatus('./');
});


ipcMain.handle('GF_gitCommitConfirm', async (event, rootPath, commitMessage, authorName, authorEmail) => {
    const result = await gitCommit(rootPath, commitMessage, authorName, authorEmail);
    if (result == true) {
        event.sender.send('RefreshAll');
        return result;
    } else {
        return result;
    }
});