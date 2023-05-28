const { ipcMain } = require('electron');
const { GetGitStatus, gitAdd } = require('./functions');

//for US/S: getFile's Data
ipcMain.handle('SUS_GitStatus', async (event, rootPath) => {
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

ipcMain.handle('SUS_GitAdd', async (event, SelectedFiles, length) => {
  await gitAdd(SelectedFiles, length);
});
