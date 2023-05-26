const { ipcMain, dialog } = require('electron');
const { commitStatus, gitCommit, gitInit } = require('./functions')

// OS 파일탐색기로 베이스 디렉토리 지정 후 절대경로 반환.
ipcMain.handle('MB_getRoot', async (event) => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    const resultPath = result.filePaths[0];
    if (resultPath != null) {
      return resultPath;
    } else {
      return resultPath;
    }
  });

//for menubar : clicking gitInit
ipcMain.handle('MB_gitInit', async (event) => {
    let currPath;
    if (CurrPath === '') {    // use triple equals for comparison
        currPath = RootPath;
    } else {
        currPath = CurrPath;
    }
    console.log('MB_currentPath :', currPath);
    const gitInitResult = await gitInit(currPath);
    return gitInitResult;
});

ipcMain.handle('MB_gitCommitTry', async (event) => {
    return await commitStatus(RootPath);
});


ipcMain.handle('MB_gitCommitConfirm', async (event, commitMessage, authorName, authorEmail) => {
    await gitCommit(commitMessage, authorName, authorEmail);
    sendRootChanged(RootPath);
});