const { ipcMain } = require('electron');
const { getCommitHistory } = require('./functions')


ipcMain.handle('GH_gethistory', async () => {
  const commits = await getCommitHistory();
  return commits;
});