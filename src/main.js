const { app, BrowserWindow, ipcMain, dialog } = require('electron');  //importing electrons
const git = require('isomorphic-git'); // importing Isomorpihic git.
const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

var RootPath = '';
var CurrPath = '';

let win = null;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  win.loadURL("http://localhost:3000");
};
app.whenReady().then(() => {
  createWindow()
});
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

//syncronize function between Menubar and Flmngr
function sendRootChanged(rootPath) {
  RootPath = rootPath;
  console.log('Root changed :', RootPath);
  sendCurrentChanged(rootPath);
  win.webContents.send('RootNameChanged', path.basename(RootPath));
};

//for syncronize function between Flmngr and US/S
function sendCurrentChanged(currentPath) {
  console.log('current changed : ', currentPath);
  win.webContents.send('CurrentPathChanged', currentPath);
};

//for gitManaging
async function del(file){
  fs.unlink(file, function(err){
    if(err) {
      console.log("Error : ", err)
    }
  })
};

//for gitManaging
async function rename(original, target){
  fs.rename(original, target, function (err) {
    if (err) throw err;
    console.log('File Renamed!');
  }); 
};

//for gitManaging
function sendFileOpen(fileStatus) {
  console.log('File open request :', fileStatus);
  win.webContents.send('openingFiles', fileStatus);
};

//for Menubar
const gitInit = async callback => {
  try {
    await git.resolveRef({ fs, dir: CurrPath, ref: 'HEAD' });
    console.log('This repository is already initialized.');
    return callback(true);
  } catch (err) {
    await git.init({ fs, dir: CurrPath});
    console.log('Repository initialized.');
    sendRootChanged(CurrPath);
    return callback(false);
  }
};

const gitCommit = async(commitMessage, authorName, authorEmail) => {
  let sha = await git.commit({
    fs,
    dir: RootPath,
    author: {
      name : authorName,
      email : authorEmail
    },
    message : commitMessage
  });
  console.log('committed :', sha);
  return sha;
};

ipcMain.handle('gitCommitTry', async(event) => {
  return new Promise((resolve, reject) => {
    getGitStat(RootPath, (err, fileList) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileList);
      }
    });
  });
});

ipcMain.handle('gitCommitConfirm', async(event, commitMessage, authorName, authorEmail) => {
  await gitCommit(commitMessage, authorName, authorEmail);
  sendRootChanged(RootPath);
});


//for gitManaging
const manageFile = async ({ action, newName, fileInfo }) => {
  const filePath = fileInfo.Path;
  const subDir = path.join(RootPath, '/');
  const gitName = filePath.replace(subDir, '');
  switch (action) {
    case 'Rename':
      if(newName === 'undefined'){
        break;
      }
      const targetName = gitName.replace(fileInfo.Name, newName);
      await git.remove({fs, dir: RootPath, filepath: gitName});
      rename(path.join(subDir, gitName), path.join(subDir, targetName));
      await git.add({fs, dir: RootPath, filepath: targetName});
      break;
    case 'Delete':
      await git.remove({fs, dir: RootPath, filepath: gitName});
      del(filePath);
      break;
    case 'Untrack':
      await git.remove({fs, dir: RootPath, filepath: gitName});
      break;
    case 'Restore':
      await git.checkout({fs, dir: RootPath, force: true, filepaths: [gitName]});
      break;
    default:
      console.error(`Unsupported action: ${action}`);
      break;
  }
};

//for GitManaging:
const readGitFile = async (fileEntry) => {
  const targetPath = fileEntry.id;
  const subDir = path.join(RootPath, '/');
  const gitName = targetPath.replace(subDir, '');
  const fileName = fileEntry.name;

  let gitFileStat;
  try {
    gitFileStat = await git.status({ fs, dir: subDir, filepath: gitName });
  } catch {
    console.log('error getting gitstat : file');
  }

  let flag;
  if (gitFileStat === '*modified' || gitFileStat === 'modified') {
    flag = true;
  } else if (gitFileStat === '*unmodified' || gitFileStat === 'unmodified') {
    flag = true;
  } else {
    flag = false;
  }

  const fileInfo = {
    Name: fileName,
    Path: targetPath,
    Status: gitFileStat,
    Open: flag
  }
  return fileInfo;
};

//for Flmngr :  
const readDirInfo = (currentPath, callback) => {
  //console.log('readDirInfo/start/dirPath :', dirPath);
  if (currentPath === '' && RootPath === '') {
    callback(null, []);
  } else if (currentPath === '') {
    currentPath = RootPath;
  }
  fs.readdir(currentPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      callback(err, null);
      return;
    }

    const DirContents = [];

    files.forEach((file) => {
      const filePath = path.join(currentPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        const fileInfo = {
          name: file,
          type: stats.isFile() ? 'file' : stats.isDirectory() ? 'folder' : '',
          id: stats.isFile() ? filePath : stats.isDirectory() ? path.join(filePath, '/') : '',
          hash: '/'
        };
        DirContents.push(fileInfo);

        if (DirContents.length === files.length) {
          callback(null, DirContents);
        }
      });
    });
  });
};

const getGitStat = async (currentPath, callback) => {
  // .gitignore 파일을 처리합니다.
  const gitignorePath = path.join(RootPath, '.gitignore');
  let ig = ignore();

  try {
    const gitignoreContent = await fs.promises.readFile(gitignorePath, 'utf8');
    ig.add(gitignoreContent);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('.gitignore 파일이 없습니다.');
    } else {
      console.error('An error occurred:', err);
    }
  }

  // 저장소의 모든 파일 목록을 가져옵니다 (untracked 포함, .gitignore에 해당하는 파일 제외).
  const allFiles = await getAllFiles(RootPath, [], ig);

  const fileStatsPromises = allFiles.map(async (filePath) => {
    const relativePath = path.relative(RootPath, filePath);

    try {
      const fileStat = await git.status({ fs, dir: RootPath, filepath: relativePath });
      const staged = fileStat.startsWith('*');

      let fileStatus;
      if (fileStat.includes('added')) {
        fileStatus = 'untracked';
      } else if (fileStat === 'modified' || fileStat === '*modified') {
        fileStatus = 'modified';
      } else {
        return null;
      }

      return {
        name: relativePath,
        staged: staged,
        status: fileStatus,
      };
    } catch (err) {
      if (err.code === 'ReadObjectFail') {
        // untracked 파일입니다.
        return {
          name: relativePath,
          staged: false,
          status: 'untracked',
        };
      } else {
        console.error('An error occurred:', err);
        return null;
      }
    }
  });

  const dirStat = await Promise.all(fileStatsPromises);
  const f_DirStat = dirStat.filter((item) => item !== null);

  callback(null, f_DirStat);
};

//for US/S :
const gitModify = async (SelectedFiles, length, callback) => {
  for (let i = 0; i < length; i++) {
    if (SelectedFiles[i].staged == true) {
      const gitMod = await git.add({ fs, dir: RootPath, filepath: SelectedFiles[i].name });
      callback(gitMod);
    } else {
      const gitMod = await git.resetIndex({ fs, dir: RootPath, filepath: SelectedFiles[i].name });
      callback(gitMod)
    }
  }
};

//for menubar : clicking gitInit
ipcMain.handle('gitInit', async (event) => {
  return await gitInit((currentPath) => {
    console.log(currentPath);
    return currentPath;
  });
});


//for menubar : clicking setDir
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

//for Flmngr
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

//for gitManaging
ipcMain.handle('OpenFile', async (event, fileEntry) => {
  const fileInfo = await readGitFile(fileEntry);
  sendFileOpen(fileInfo);
});

//for gitManaging
ipcMain.handle('executeAction', (event, data) => {
  console.log(data);
  manageFile(data);
  sendRootChanged(RootPath);
});

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



