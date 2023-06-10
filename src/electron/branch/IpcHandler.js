const {ipcMain} = require('electron');  //importing electrons
const {createBranch, deleteBranch, renameBranch, checkoutBranch, listBranches} = require('./functions')

ipcMain.handle('BR_createbranch', async (event, branchName) => {
    return createBranch(branchName);
});

ipcMain.handle('BR_deletebranch', async (event, branchName) => {
    return deleteBranch(branchName);
});

ipcMain.handle('BR_renamebranch', async (event, oldName, newName) => {
    return await renameBranch(oldName, newName);
});

ipcMain.handle('BR_checkout', async (event, branchName) => {
    return checkoutBranch(branchName);
});
