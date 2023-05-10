// back-end 
//Todo until 5/10
//2. build code : handling git add, git restore --staged
//[1] bsPath :  /Users/mj/Desktop/OSW23/localrepo/Frontend
const { app, BrowserWindow, ipcMain } = require('electron')  //importing electrons
const git = require('isomorphic-git'); // importing Isomorpihic git.
const fs = require('fs') 
const path = require('path')

var AbsPath = '/Users/mj/Desktop/OSW23/localrepo/Frontend/'; //테스트시  테스트 폴더의 절대경로를 넣어주세요.
var RelPath = './';

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
function sendAbsChanged(absPath){
  AbsPath = absPath;
  win.webContents.send('AbsPathChanged', AbsPath);
}

//for syncronize function between Flmngr and US/S
function sendRelChanged(relPath) {
  RelPath = relPath;
  win.webContents.send('RelPathChanged', RelPath);
}

//for Menubar

//for Menubar


//for Flmngr :  
const readDirInfo = (dirPath, callback) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      callback(err, null);
      return;
    }

    const DirContents = [];
    const basePath = path.basename(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        const fileInfo = {
          name: file,
          type: stats.isFile() ? 'file' : stats.isDirectory() ? 'folder' : '',
          id: stats.isFile() ? dirPath + file: stats.isDirectory() ? dirPath + file + '/' : '',
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
const getGitStat = async (dirPath, callback) => {
  try {
    fs.readdir(dirPath, async (err, files) => {
      if (err) {
        console.error('Error getting GitStat:', err);
        callback(err, null);
        return;
      }
      const fileStatsPromises = files.map((file) =>
        new Promise(async (resolve) => {
          const filePath = path.join(AbsPath, dirPath, file);
          const fileName = filePath.replace(AbsPath, '');

          fs.stat(filePath, async (err, stats) => {
            if (file.startsWith('.') || stats.isDirectory()) {
              resolve(null);
            } else {
              const fileStat = await git.status({
                fs,
                dir: AbsPath,
                filepath: fileName,
              });
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
                name: file,
                staged: staged,
                status: fileStatus,
                gitName : fileName
              });
            }
          });
        })
      );

      const dirStat = await Promise.all(fileStatsPromises);
      const f_DirStat = dirStat.filter((item) => item !== null);
      callback(null, f_DirStat);
    });
  } catch (err) {
    console.error('Error in getGitStat:', err);
    callback(err, null);
  }
};

//for US/S :
const gitModify = async(SelectedFiles, length, callback) => {
  for(let i = 0; i < length; i++){
    if(SelectedFiles[i].staged == true){
      const gitMod = await git.add({ fs, dir: AbsPath, filepath: SelectedFiles[i].gitName});
      callback(gitMod);
    }else{
      const gitMod = await git.resetIndex({fs, dir: AbsPath, filepath: SelectedFiles[i].gitName});
      callback(gitMod)
    }
  }
};

//for Flmngr :
ipcMain.handle('ReadDir', async (event, DirPath) => {
  sendRelChanged(DirPath);
  return new Promise((resolve, reject) => {
    readDirInfo(DirPath, (err, fileList) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileList);
      }
    });
  });
});

//for Flmngr:
ipcMain.handle('getGitStat', async (event) => {
  return new Promise((resolve, reject) => {
    getGitStat(RelPath, (err, fileList) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileList);
      }
    });
  });
});

//for US/S :
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

//for US/S :
ipcMain.handle('gitRestore', async (event, fileName) => {
  return new Promise((resolve, reject) => {
  });
});


