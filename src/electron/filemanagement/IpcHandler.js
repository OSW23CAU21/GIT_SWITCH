const {ipcMain} = require('electron');  //importing electrons
const { spawn } = require('child_process');
const {readDirInfo, getFolderChain} = require('./functions')

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



ipcMain.handle('FM_openFile', async (event, rootPath, filePath) => {
  spawn('code', [rootPath, '-g', filePath]);

  return true;
});

