const { ipcMain } = require('electron');  //importing electrons
const { readGitStatus, getCurrentBranch, GitRename, GitDelete, GitUntrack, GitRestore } = require('./functions')

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


ipcMain.handle('GM_branchName', async (event, rootPath) => {
  return getCurrentBranch(rootPath);
});


ipcMain.handle('GM_GitRename', async (event, rootPath, selectedFile, newName) => {
  const result = await GitRename(rootPath, selectedFile, newName);
  if (result == true) {
    event.sender.send('RefreshAll');
    return result;
  } else {
    return result;
  }
});

ipcMain.handle('GM_GitDelete', async (event, rootPath, selectedFiles) => {
  const result = await GitDelete(rootPath, selectedFiles);
  if (result == true) {
    event.sender.send('RefreshAll');
    return result;
  } else {
    return result;
  }
});

ipcMain.handle('GM_GitRestore', async (event, rootPath, selectedFiles) => {
  const result = await GitRestore(rootPath, selectedFiles);
  if (result == true) {
    event.sender.send('RefreshAll');
    return result;
  } else {
    return result;
  }
});

ipcMain.handle('GM_GitUntrack', async (event, rootPath, selectedFiles) => {
  const result = await GitUntrack(rootPath, selectedFiles);
  if (result == true) {
    event.sender.send('RefreshAll');
    return result;
  } else {
    return result;
  }
});