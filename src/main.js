// back-end 
//Todo until 5/09
//1. build code : getDir using gitStat
//2. build code : handling git add, git restore --staged
//[1] bsPath :  /Users/mj/Desktop/OSW23/localrepo/Frontend
const { app, BrowserWindow, ipcMain } = require('electron')  //importing electrons
const git = require('isomorphic-git'); // importing Isomorpihic git.
const fs = require('fs') 
const path = require('path')

var AbsPath = '/Users/mj/Desktop/OSW23/localrepo/Frontend/';
var RelPath = './';

/*git.init({ // example of intiate git repo.
  fs,
  dir: '/Users/mj/Desktop/OSW23/flmngr/', // Please enter your path
})
  .then(() => console.log('Repo init!'))
  .catch((err) => console.error('Error to init:', err));*/

  const GitStat = async (relPath, fileName) => {
    try {
      const status = await git.status({ fs, dir: '/Users/mj/Desktop/OSW23/localrepo/Frontend/', filepath: 'src/main.js'});
      console.log('stats : ', status);
      console.log(relPath);
    } catch (error) {
      console.error('Error while checking git status:', error);
    }
  };

  const GitStage = async(relPath) => {
    try {
      let files = await git.listFiles({ fs, dir: relPath, ref: 'HEAD' })
      console.log('staged : ', files);
    } catch (error){
      console.error('Error while checking gitStage:', error);
    }
  }

  //GitStage('./');
  GitStat('./', 'README.md');
  const filePath4 = path.join(AbsPath, './src', 'main.js');
  console.log(filePath4);

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

function sendRelChanged(dirPath) {
  RelPath = dirPath;
  win.webContents.send('RelPathChanged', RelPath);
}
//for Menubar

//for Menubar


//for Filemanagement
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

//for Filemanagement
ipcMain.handle('ReadDir', async (event, DirPath) => { // DirPath are string for exapmle "./osw23/team21/"
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

// for unStaged/Staged
/*
const getGitStat = async(dirPath, callback) => {
  try{
  fs.readdir(dirPath, async(err, files) => {
    if (err) {
      console.error('Error getting GitStat:', err);
      callback(err, null);
      return;
    }
    const DirStat = [];
    for(const file of files){
      const filePath = path.join(dirPath, file);
      fs.stat(filePath, async (err, stats) => {
        if(file.startsWith('.')){
        }else if(stats.isDirectory()){
        }else{
        const fileStat = await git.status({fs, dir : dirPath, filepath : file});
        console.log("Pushed : ", file);
        console.log("fileStat : ", fileStat);
        const staged = fileStat.startsWith('*');
        let fileStatus;
  
        if (fileStat.includes('added')) {
          fileStatus = 'untracked';
        } else if (fileStat.includes('modified')) {
          fileStatus = 'modified';
        } else {
          fileStatus = 'unknown';
        }
        DirStat.push({
          Name: file,
          Staged: staged,
          Status: fileStatus
        });
        }
      });
      console.log("DirStat", DirStat);
    }
    callback(null, DirStat);
  });
  } catch {
    console.error('Error in getGitStat :', error);
    callback(error, null);
  }
}; */

const getGitStat = async (dirPath, callback) => { //checking GitStatus from Current Directory
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
              });
            }
          });
        })
      );

      const dirStat = await Promise.all(fileStatsPromises);
      const f_DirStat = dirStat.filter((item) => item !== null);
      console.log(f_DirStat);
      callback(null, f_DirStat);
    });
  } catch (error) {
    console.error('Error in getGitStat:', error);
    callback(error, null);
  }
};



ipcMain.handle('getGitStat', async (event) => { // DirPath are string for exapmle "./osw23/team21/"
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

/*ipcMain.handle('gitAdd', async (event) => { //use override to config git add "filename" and git add .
  return new Promise((resolve, reject) => {
  });
});

ipcMain.handle('gitRestore', async (event) => { // override needed?
  return new Promise((resolve, reject) => {
  });
});
*/

