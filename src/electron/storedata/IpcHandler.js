const {storeAuthor, callAuthor, storePath, callPath, storeToken, callToken} = require('./Functions');
const {ipcMain} = require('electron');

ipcMain.handle('SD_storepath', async (event, rootPath) => {
    storePath(rootPath);
});

ipcMain.handle('SD_storetoken', async (event, token) => {
    storeToken(token);
    event.sender.send('Refresh_token');
});

ipcMain.handle('SD_storeauthor', async (event, name, email) => {
    storeAuthor(name, email);
    event.sender.send('Refresh_author');
});

ipcMain.handle('SD_callpath', async (event) => {
    const rootPath = await callPath();
    return rootPath;
});

ipcMain.handle('SD_calltoken', async (event) => {
    const token = await callToken();
    return token;
});

ipcMain.handle('SD_callauthor', async (event) => {
    const author = await callAuthor();
    return author;
});