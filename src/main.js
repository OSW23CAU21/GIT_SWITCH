const { app, BrowserWindow, ipcMain, dialog } = require('electron');  //importing electrons
const git = require('isomorphic-git'); // importing Isomorpihic git.
const fs = require('fs'); 
const path = require('path');

var RootPath = ''; 

let win = null;
function createWindow () { 
  win = new BrowserWindow({ 
    width: 800, 
    height: 1000, 
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation : false
    } 
  }) 
  win.loadURL("http://localhost:3000");
} 
app.whenReady().then(() => { 
  createWindow() 
}) 
app.on('window-all-closed', function () { 
  if (process.platform !== 'darwin') app.quit() 
})

//syncronize function between Menubar and Flmngr
function sendRootChanged(rootPath){
  RootPath = rootPath;
  console.log('Root changed :', path.basename(RootPath));
  win.webContents.send('RootNameChanged', path.basename(RootPath));
}

//for syncronize function between Flmngr and US/S
function sendCurrentChanged(currentPath) {
  console.log('current changed : ', currentPath);
  win.webContents.send('CurrentPathChanged', currentPath);
}

//for Menubar

//for Menubar


//for Flmngr :  
const readDirInfo = (currentPath, callback) => {
  //console.log('readDirInfo/start/dirPath :', dirPath);
  if(currentPath === '' && RootPath === ''){
    callback(null, []);
  }else if(currentPath === ''){
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

//for US/S :
const getGitStat = async (currentPath, callback) => {
  let dirPath;
  if(currentPath===''&&RootPath===''){
    dirPath = './'; // 초기화면 선택 된 폴더 없음.
    return;
  }else if(currentPath===''){
    dirPath = RootPath; // 선택 된 폴더가 있으나, Root 상태
  }else{
    dirPath = currentPath; // Root 내부의 폴더를 브라우징 중.
  }
  //console.log('gitStat/dirPath :', dirPath);
    fs.readdir(dirPath, async (err, files) => {
      const fileStatsPromises = files.map((file) =>
        new Promise(async (resolve) => {
          const targetPath = path.resolve(RootPath, dirPath, file); // git 상태를 조회하려는 파일의 절대경로.
          const subDir = path.join(RootPath, '/'); // git 이름을 계산하기 위한 경로.
          const fileName = targetPath.replace(subDir, ''); //git 기준 파일명.
          //console.log('[filePath :', targetPath, ']\n[subDir : ', subDir, ']\n[fileName : ', fileName, ']\n');
          fs.stat(targetPath, async (err, stats) => {
            if (fileName.startsWith('.') || stats.isDirectory()) {
              //console.log('filtered : ', targetPath);
              resolve(null);
            } else {
              try{
              //console.log('gitStat.... /DirPath:', targetPath);
              const fileStat = await git.status({
                fs,
                dir: subDir,
                filepath: fileName,
              });
              //console.log('fileName : ', fileName, '\n fileStat : ', fileStat);
              const staged = fileStat.startsWith('*');
              let fileStatus;
              if (fileStat.includes('added')) {
                fileStatus = 'untracked';
              } else if ( fileStat==='modified' || fileStat ==='*modified') {
                fileStatus = 'modified';
              } else {
                resolve(null);
              }
              resolve({
                name: fileName,
                staged: staged,
                status: fileStatus
              });
              }catch{
                console.error(err);
                //console.log('error occured :', targetPath);
              }
            }
          });
        })
      );

      const dirStat = await Promise.all(fileStatsPromises);
      const f_DirStat = dirStat.filter((item) => item !== null);
      //console.log(f_DirStat);
      callback(null, f_DirStat);
    });
};

//for US/S :
const gitModify = async(SelectedFiles, length, callback) => {
  for(let i = 0; i < length; i++){
    if(SelectedFiles[i].staged == true){
      const gitMod = await git.add({ fs, dir: RootPath, filepath: SelectedFiles[i].name});
      callback(gitMod);
    }else{
      const gitMod = await git.resetIndex({fs, dir: RootPath, filepath: SelectedFiles[i].name});
      callback(gitMod)
    }
  }
};

//for menubar : clicking gitInit
ipcMain.handle('gitInit', async (event) =>{

});

//for menubar : clicking setDir
ipcMain.handle('getRoot', async (event) => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  const resultPath = result.filePaths[0];
  if(resultPath != null){
    sendRootChanged(resultPath);
    return resultPath
  }else{
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


