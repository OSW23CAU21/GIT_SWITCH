const {ipcMain} = require('electron');  //importing electrons
const {createBranch, deleteBranch, renameBranch, checkoutBranch, listBranches} = require('./functions')

ipcMain.handle('BR_createbranch', async (event, branchName) => {
    const result = await createBranch(branchName);
    if(result.result){
        event.sender.send('Refresh_BranchList');
    }
    return result;
});

ipcMain.handle('BR_deletebranch', async (event, branchName) => {
    const result = await deleteBranch(branchName);
    if(result.result){
        event.sender.send('Refresh_BranchList');
    }
    return result;
});

ipcMain.handle('BR_renamebranch', async (event, oldName, newName) => {
    const result = await renameBranch(oldName, newName);
    if(result.result){
        event.sender.send('Refresh_BranchList');
    }
    return result;
});

ipcMain.handle('BR_checkout', async (event, branchName) => {
    const result = await checkoutBranch(branchName);
    if(result.result){
        event.sender.send('Refresh_SUS');
        event.sender.send('Refresh_GM');
        event.sender.send('Refresh_branchname', branchName);
        event.sender.send('Refresh_BranchList');
        event.sender.send('Refresh_FM');
    }
    return result;

});
