const { ipcMain } = require('electron');

//메뉴바 이벤트 핸들러.
function MenubarHandlers() {
  // 메뉴바에서 gitInit 클릭시 작동.
  ipcMain.handle('gitInit', async (event) => {
    let currPath;
    if (CurrPath === '') {    // use triple equals for comparison
      currPath = RootPath;
    } else {
      currPath = CurrPath;
    }
    console.log('currentPath :', currPath);
    const gitInitResult = await gitInit(currPath);
    return gitInitResult;
  });


  //메뉴바에서 setDir 클릭시 작동.
  ipcMain.handle('getRoot', async (event) => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    const resultPath = result.filePaths[0];
    if (resultPath != null) {
      sendRootChanged(resultPath);
      return resultPath
    } else {
      return resultPath;
    }
  });

  // 메뉴바에서 Commit 클릭시 작동.
  ipcMain.handle('gitCommitTry', async (event) => {
    return await commitStatus(RootPath);
  });


  // Commit 팝업창에서 Confirm 클릭시 작동.
  ipcMain.handle('gitCommitConfirm', async (event, commitMessage, authorName, authorEmail) => {
    await gitCommit(commitMessage, authorName, authorEmail);
    sendRootChanged(RootPath);
  });
}

//GUI 파일매니지먼트 핸들러
function FileManagementHandlers() {
  // 파일 읽어오기. 
  ipcMain.handle('ReadDir', async (event, currentPath) => {
    //console.log('ReadDir/DirPath :', DirPath);
    sendCurrentChanged(currentPath);
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

  // 파일 더블클릭시 작동.
  ipcMain.handle('OpenFile', async (event, fileEntry) => {
    const fileInfo = await readGitFile(fileEntry);
    sendFileOpen(fileInfo);
  });

  // 더블클릭후 팝업창에서 확인시 
  ipcMain.handle('executeAction', (event, data) => {
    console.log(data);
    manageFile(data);
    sendRootChanged(RootPath);
  });
}

//US, S 이벤트 핸들러.
function UnstagedStagedHandlers() {
  //for US/S: getFile's Data
  ipcMain.handle('getGitStat', async (event, currentPath) => {
    return new Promise((resolve, reject) => {
      getGitStat(currentPath, (err, fileList) => {
        if (err) {
          reject(err);
        } else {
          resolve(fileList);
        }
      });
    });
  });

  //for US/S: clicking "선택한 파일 이동"
  ipcMain.handle('gitModify', async (event, SelectedFiles, length) => {
    return new Promise((resolve, reject) => {
      gitModify(SelectedFiles, length, (err, gitMod) => {
        if (err) {
          reject(err);
        } else {
          resolve(gitMod);
        }
      });
    });
  });

}

module.exports = { MenubarHandlers, FileManagementHandlers, UnstagedStagedHandlers }