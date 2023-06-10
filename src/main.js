const {app, BrowserWindow ,ipcMain, dialog } = require('electron');  //importing electrons
require('./electron/menubar/IpcHandler'); //menubar event handlers
require('./electron/filemanagement/IpcHandler'); // GUI Filemanager event handlers
require('./electron/gitmanagement/IpcHandler'); // GUI Gitmanager event handlers
require('./electron/unstagedstaged/IpcHandler'); // S/US event handlers
require('./electron/gitfab/IpcHandler'); //Git FAB event handlers
require('./electron/gitdiff/IpcHandler'); // git diff event handlers
require('./electron/storedata/IpcHandler'); // store data using electron-store
require('./electron/branch/IpcHandler');
require('./electron/githistory/IpcHandler');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 1000,
    titleBarStyle: 'hiddenInset',
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
