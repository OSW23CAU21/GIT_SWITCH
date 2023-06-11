const { ipcMain } = require('electron');
const { commitStatus, gitCommit, gitClone, getBranchList, getBranchName, mergeBranch, checkInit, gitInit } = require('./functions');

ipcMain.handle('GF_gitCommitTry', async (event) => {
    return await commitStatus();
});

ipcMain.handle('GF_checkinit', async (event) => {
    const result = await checkInit();
    return result;
})

ipcMain.handle('GF_gitinit', async (event) => {
    const result = await gitInit();
    if(result.result){
        event.sender.send('Refresh_FM');
        return result;
    }else {
        return result;
    }
})


ipcMain.handle('GF_gitCommitConfirm', async (event, commitMessage, authorName, authorEmail) => {
    const result = await gitCommit(commitMessage, authorName, authorEmail);
    if (result == true) {
        event.sender.send('Refresh_SUS');
        event.sender.send('Refresh_GM');
        return result;
    } else {
        return result;
    }
});

ipcMain.handle('GF_gitClone', async(event, url, tokens) => {
    const result = await gitClone(url, tokens);
    if (result.result == true) {
        event.sender.send('Refresh_SUS');
        event.sender.send('Refresh_GM');
        event.sender.send('Refresh_FM');
        return result;
    } else {
        return result;
    }
});

ipcMain.handle('GF_branchlist', async(event) => {
    const result = await getBranchList();
    return result;
});


ipcMain.handle('GF_branchname', async(event) => {
    const result = await getBranchName();
    return result;
});

ipcMain.handle('GF_mergebranch', async(event, current, target) => {
    const result = await mergeBranch(current, target);
    return result;
});

