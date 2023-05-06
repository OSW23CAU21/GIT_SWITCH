const { app, BrowserWindow, ipcMain } = require('electron') 
const fs = require('fs')
const path = require('path') 
function createWindow () { 
  const win = new BrowserWindow({ 
    width: 800, 
    height: 600, 
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation : false
    } 
  }) 
  win.loadURL("http://localhost:3000")
} 
app.whenReady().then(() => { 
  createWindow() 
}) 
app.on('window-all-closed', function () { 
  if (process.platform !== 'darwin') app.quit() 
})

const readDirectoryInfo = (dirPath, callback) => {
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
          id: stats.isFile() ? dirPath + file : stats.isDirectory() ? dirPath + file +'/' : '',
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

ipcMain.handle('ReadDir', async (event, DirPath) => { // DirPath are string for exapmle "./osw23/team21/"
  return new Promise((resolve, reject) => {
    readDirectoryInfo(DirPath, (err, fileInfoList) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileInfoList);
      }
    });
  });
});


