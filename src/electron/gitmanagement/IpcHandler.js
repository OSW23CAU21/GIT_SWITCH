const {ipcMain} = require('electron');  //importing electrons
const {readGitStatus} = require('./functions')
var RootPath = '';
var CurrPath = '';


//for Flmngr
ipcMain.handle('readGit', async (event, currentPath) => {
  return new Promise((resolve, reject) => {
    readGitStatus(currentPath, (err, fileList) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileList);
      }
    });
  });
});


