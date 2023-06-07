const {ipcMain} = require('electron');  //importing electrons
const {diffRead} = require('./functions');

ipcMain.handle('GD_readDiff', async (event, rootPath, filePath) => {
    const result = await diffRead(rootPath, filePath);
    return result;
});