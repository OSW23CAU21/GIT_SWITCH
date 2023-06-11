const { ipcMain } = require('electron');
const { getCommitHistory } = require('./functions')


ipcMain.handle('GH_gethistory', async (event, branchName) => {
  const commits = await getCommitHistory(branchName);
  return commits;
});