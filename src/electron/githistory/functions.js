const { app, BrowserWindow, ipcMain } = require('electron');
const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');
const store = require('electron-store');

const storage = new store;

async function getCommitHistory(branchName){
    console.log(branchName);
    const commits = await git.log({ fs, dir : storage.get('BasePath'), ref : branchName });
    return commits;
}


module.exports = {getCommitHistory}