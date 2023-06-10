const { app, BrowserWindow, ipcMain } = require('electron');
const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');
const store = require('electron-store');

const storage = new store;

async function getCommitHistory(){
    const commits = await git.log({ fs, dir : storage.get('BasePath'), ref : 'main' });
    return commits;
}


module.exports = {getCommitHistory}