const {ipcMain} = require('electron');  //importing electrons
const {readGitStatus, getCurrentBranch} = require('./functions')

//for gitSpace
ipcMain.handle('GM_readGit', async (event, rootPath, currentPath) => {
  return new Promise((resolve, reject) => {
    readGitStatus(rootPath, currentPath, (err, fileEntries) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileEntries);
      }
    });
  });
});


ipcMain.handle('GM_branchName', async (event, rootPath) =>{
  return getCurrentBranch(rootPath);
});