const {ipcMain} = require('electron');  //importing electrons
const {readDirInfo, getFolderChain} = require('./functions')
var RootPath = '';
var CurrPath = '';


//for Flmngr
ipcMain.handle('FM_ReadDirectory', async (event, currentPath) => {
  return new Promise((resolve, reject) => {
    readDirInfo(currentPath, (err, fileList) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileList);
      }
    });
  });
});

ipcMain.handle('FM_getFolderChain', async (event, directoryPath) => {
  return getFolderChain(directoryPath);
});

