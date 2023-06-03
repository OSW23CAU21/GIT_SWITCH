const {ipcMain} = require('electron');  //importing electrons
const {createBranch, deleteBranch, renameBranch, checkoutBranch} = require('./functions')

ipcMain.handle('create_branch', async (event, currentPath, branchName) => {
    return createBranch(currentPath, branchName);
});

ipcMain.handle('delete_branch', async (event, currentPath, branchName) => {
    return deleteBranch(currentPath, branchName);
});

ipcMain.handle('rename_branch', async (event, currentPath, oldName, newName) => {
    return renameBranch(currentPath, oldName, newName);
});

ipcMain.handle('checkout_branch', async (event, currentPath, branchName) => {
    return checkoutBranch(currentPath, branchName);
});