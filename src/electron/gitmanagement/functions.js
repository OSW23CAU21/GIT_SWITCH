const git = require('isomorphic-git'); // importing Isomorpihic git.
const fs = require('fs');
const path = require('path');

const color_Default = '#999999';
const color_UnModified = ''

const color_Modified_S = '#0000cc';
const color_Modified_U = '#9999ff';
const color_Modified_SUS = '#000066';

const color_Deleted_S = '#FF0000';
const color_Deleted_US = '#FFBDBD';

const color_Added_S = '#00cc00';
const color_Added_SUS = '#009900';
const color_Untracked_US = '#99ff99';

var gitEntries = [];


const checkGitStatus = async (rootPath, callback) => {
    let GitMatrix;
    let fileEntry;
    try {
        GitMatrix = await git.statusMatrix({ fs, dir: rootPath });
    } catch {
        console.log('error to get GitMatrix');
    }
    for (const [filePath, HeadStatus, WorkdirStatus, StageStatus] of GitMatrix) {
        if (HeadStatus === 0 && WorkdirStatus === 2) { // untracked, added
            fileEntry = { id: filePath, name: path.basename(filePath), color: color_Untracked_US };
            if (StageStatus === 2) {
                fileEntry.color = color_Added_S
            } else if (StageStatus === 3) {
                fileEntry.color = color_Added_SUS
            }
        } else if (HeadStatus === 1 && WorkdirStatus === 0) {// deleted
            fileEntry = { id: filePath, name: path.basename(filePath), color: color_Deleted_US };
            if (StageStatus === 0) {
                fileEntry.color = color_Deleted_S
            }
        } else if (HeadStatus === 1 && WorkdirStatus === 2) { // modified
            fileEntry = { id: filePath, name: path.basename(filePath), color: color_Modified_S };
            if (StageStatus === 1) {
                fileEntry.color = color_Modified_U
            } else if (StageStatus === 3) {
                fileEntry.color = color_Modified_SUS
            }
        } else { // modified 1.1.1  or something.
            continue;
        }
        gitEntries.push(fileEntry);
    }
    callback(null);
};

const readGitStatus = async (rootPath, currentPath, callback) => {
    console.log('gitEntries : ', gitEntries);
    if (gitEntries.length == 0) {
        try {
            await checkGitStatus(rootPath);
        } catch {
            console.log('something error in check git status');
        }
    }

    try {
        fs.readdir(currentPath, async (err, files) => {
            const gitSpaceMatrix = files.map((file) => new Promise((resolve, reject) => {
                const absolutePath = path.join(currentPath, file);
                const subPath = path.join(rootPath, '/');
                const gitFilePath = absolutePath.replace(subPath, '');
                const searchedEntry = gitEntries.find(entry => entry.id === gitFilePath);

                if (searchedEntry === undefined) {
                    fs.stat(absolutePath, (err, stats) => {
                        if (err) {
                            console.error(err);
                            reject(null);
                        }
                        console.log('resolving, ', file, 'from ', absolutePath);
                        if (stats.isDirectory()) {
                            resolve({ id: absolutePath, name: file, isDir: true });
                        } else {
                            resolve({ id: gitFilePath, name: file, color: color_Default });
                        }
                    })
                } else {
                    resolve(searchedEntry);
                }
            }));

            const resultMatrix = await Promise.all(gitSpaceMatrix);
            callback(null, resultMatrix);
        });

    } catch (err) {
        console.error(err);
    }
}

const getCurrentBranch = async (rootPath) =>{
    const branchname = await git.currentBranch({fs, dir : rootPath, fullname : false});

    return branchname;
}

module.exports = { readGitStatus , getCurrentBranch};