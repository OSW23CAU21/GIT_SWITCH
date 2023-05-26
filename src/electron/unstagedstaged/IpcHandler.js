const {ipcMain} = require('electron');
const {GetGitStatus} = require('./functions');

//for US/S: getFile's Data
ipcMain.handle('GitStatus', async (event, rootPath) => {
    return new Promise((resolve, reject) => {
      GetGitStatus(rootPath, (err, fileList) => {
        if (err) {
          reject(err);
        } else {
          resolve(fileList);
        }
      });
    });
  });