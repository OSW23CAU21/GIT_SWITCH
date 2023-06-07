const {app, BrowserWindow ,ipcMain, dialog } = require('electron');  //importing electrons
require('./electron/menubar/IpcHandler'); //메뉴바 이벤트 핸들러
require('./electron/filemanagement/IpcHandler'); // GUI 파일매니저 이벤트 핸들러
require('./electron/gitmanagement/IpcHandler'); // GUI 깃매니저 이벤트 핸들러
require('./electron/unstagedstaged/IpcHandler'); // S/US 파일매니저 이벤트 핸들러
require('./electron/gitfab/IpcHandler'); //Git FAB 이벤트 핸들러
require('./electron/gitdiff/IpcHandler'); // git diff 이벤트 핸들러

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  win.loadURL("http://localhost:3000");
};

function sendRootChanged (rootPath) {
  win.webContents.send('MB_getRoot', rootPath);
};

app.whenReady().then(() => {
  createWindow()
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

module.exports = {sendRootChanged};
