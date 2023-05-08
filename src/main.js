// back-end 
//[1] bsPath :  /Users/mj/Desktop/OSW23/localrepo/Frontend
const { app, BrowserWindow, ipcMain, webContents } = require('electron') 
const git = require('isomorphic-git');
const fs = require('fs')
const path = require('path')

var RelPath = './';

git.init({
  fs,
  dir: '/Users/mj/Desktop/OSW23/flmngr/',
})
  .then(() => console.log('Repository initated!'))
  .catch((err) => console.error('Error to init repository:', err));

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
const getDirInfo = (dirPath, callback) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      callback(err, null);
      return;
    }

    const DirContents = [];
    const basePath = path.basename(dirPath);
    console.log('bsPath : ', path.resolve(dirPath));

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        const fileInfo = {
          name: file,
          staged : true
        };

        DirContents.push(fileInfo);

        if (DirContents.length === files.length) {
          callback(null, DirContents);
        }
      });
    });
  });
};


ipcMain.handle('getDir', async (event) => { // DirPath are string for exapmle "./osw23/team21/"
  DirPath = RelPath;
  return new Promise((resolve, reject) => {
    getDirInfo(DirPath, (err, fileList) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileList);
      }
    });
  });
});


