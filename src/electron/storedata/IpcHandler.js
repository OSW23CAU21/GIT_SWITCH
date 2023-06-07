const {storeAuthor, storePath, callPath, storeToken} = require('./Functions');
const {ipcMain} = require('electron');

ipcMain.handle('SD_storepath', async (event, rootPath) => {
    storePath(rootPath);
});

ipcMain.handle('SD_storetoken', async (event, token) => {
    storeToken(token);
});

ipcMain.handle('SD_storeauthor', async (event, name, email) => {
    storeAuthor(name, email);
});

ipcMain.handle('SD_callpath', async (event) => {
    const rootPath = await callPath();
    console.log('returning', rootPath, typeof rootPath);
    return rootPath;
});