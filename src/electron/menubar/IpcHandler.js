const { ipcMain, dialog } = require('electron');
const { } = require('./functions');

// OS 파일탐색기로 베이스 디렉토리 지정 후 절대경로 반환.
ipcMain.handle('MB_getRoot', async (event) => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    const resultPath = result.filePaths[0];
    if (resultPath != null) {
        event.sender.send('RootPathChanged', resultPath);
        return resultPath
    } else {
        return resultPath;
    }
});


ipcMain.handle('MB_gitCommitTry', async (event) => {
    return await commitStatus('./');
});

