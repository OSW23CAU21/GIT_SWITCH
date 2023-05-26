const git = require('isomorphic-git'); // importing Isomorpihic git.
const fs = require('fs');
const path = require('path');

var RootPath = '';
var CurrPath = '';


const readGitStatus = async (currentPath, callback) => {
    let GitMatrix;
    try {
        GitMatrix = await git.statusMatrix({ fs, dir: rootPath });
    } catch {
        console.log('error to get GitMatrix');
    }
    const FileMatrix = [];
    let fileData;
    for (const [filePath, HeadStatus, WorkdirStatus, StageStatus] of GitMatrix) {
        fileData = { id: filePath, name: path.basename(filePath), color: '#FF0044', icon: null }
        if (HeadStatus === 0 && WorkdirStatus === 2) { // untracked, added
            if (StageStatus == 2) {
                fileData.icon = null;
                fileData.color = '#0052CC';
            } else if (StageStatus == 3) {
                fileData.icon = null;
                fileData.color = '#0052CC';
            }
        } else if (HeadStatus === 1 && WorkdirStatus === 0) {// deleted
            if (StageStatus == 1) {
                fileData.icon = null;
                fileData.color = '#0052CC';
            }
        } else if (HeadStatus === 1 && WorkdirStatus === 2) { // modified
            if (StageStatus == 1) {
                fileData.icon = null;
                fileData.color = '#0052CC';
            }
        } else {
            continue;
        }
        FileMatrix.push(FileStatus);
    }
    callback(null, FileMatrix);
};


module.exports = { readGitStatus };
