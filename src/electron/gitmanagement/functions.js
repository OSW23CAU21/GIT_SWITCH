const util = require('util');
const git = require('isomorphic-git'); // importing Isomorpihic git.
const fs = require('fs');
const path = require('path');
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

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


async function del(file) {
    fs.unlink(file, function (err) {
        if (err) {
            console.log("Error : ", err)
        }
    })
};

async function rename(original, target) {
    fs.rename(original, target, function (err) {
        if (err) throw err;
        console.log('File Renamed!');
    });
};


const GitRename = async (rootPath, fileInfo, newName) => {
    const subDir = path.join(rootPath, '/');
    const gitPath = fileInfo[0].id.replace(rootPath, '');
    const targetPath = gitPath.replace(fileInfo[0].name, newName);

    try {
        await git.remove({ fs, dir: rootPath, filepath: gitPath });
        rename(path.join(subDir, gitPath), path.join(subDir, targetPath));
        await git.add({ fs, dir: rootPath, filepath: targetPath });
        return true;
    } catch (error) {
        console.error('Error: ', error);
        return false;
    }
};

const GitDelete = async (rootPath, selectedFiles) => {
    const subDir = path.join(rootPath, '/');
    try {
        const promises = selectedFiles.map(async(file) => {
            const gitPath = file.id.replace(rootPath, '');
            await git.remove({ fs, dir: rootPath, filepath: gitPath });
            del(gitPath);
        });

        await Promise.all(promises);
        return true;
    } catch (error) {
        console.error('Error: ', error);
        return false;
    }
};


const GitUntrack = async (rootPath, selectedFiles) => {
    console.log('from untrack', selectedFiles);
    const subDir = path.join(rootPath, '/');
    try {
        const promises = selectedFiles.map((file) => {
            const gitPath = file.id.replace(rootPath, '');
            return git.remove({ fs, dir: rootPath, filepath: gitPath });
        });

        await Promise.all(promises);
        return true;
    } catch (error) {
        console.error('Error: ', error);
        return false;
    }
};

const GitRestore = async (rootPath, selectedFiles) => {
    const subDir = path.join(rootPath, '/');
    try {
        const promises = selectedFiles.map(async (file) => {
            const gitPath = file.id.replace(rootPath, '');
            await git.checkout({ fs, dir: rootPath, force: true, filepaths: [gitPath] });
        });

        await Promise.all(promises);
        return true;
    } catch (error) {
        console.error('Error: ', error);
        return false;
    }
};

const checkGitStatus = async (rootPath, callback) => {
    let GitMatrix;
    let fileEntry;
    const gitEntries = [];
    try {
        GitMatrix = await git.statusMatrix({ fs, dir: rootPath });
    } catch {
        console.log('error to get GitMatrix');
    }
    for (const [filePath, HeadStatus, WorkdirStatus, StageStatus] of GitMatrix) {
        if (HeadStatus === 0 && WorkdirStatus === 2) { // untracked, added
            fileEntry = { id: filePath, name: path.basename(filePath), color: color_Untracked_US, openable : false };
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
    return gitEntries;
};

const readGitStatus = async (rootPath, currentPath, callback) => {
    let gitEntries = [];
    let resultMatrix = [];

    try {
        gitEntries = await checkGitStatus(rootPath);
    } catch(err) {
        console.error('gitSpace loading error : ', err);
        console.log(rootPath, currentPath);
    }

    let gitEntriesSet = new Set(gitEntries.map(entry => path.join(rootPath, entry.id)));

    for(let entry of gitEntries){
        const absolutePath = path.join(rootPath, entry.id);
        const dirname = path.dirname(absolutePath);

        if(dirname === currentPath){
            resultMatrix.push(entry);
        }
    }
    
    try {
        const files = await readdir(currentPath);

        const gitSpaceMatrix = files.map(async (file) => {
            const absolutePath = path.join(currentPath, file);
            const gitFilePath = absolutePath.replace(rootPath + '/', '');

            if (!gitEntriesSet.has(absolutePath)) {
                const stats = await stat(absolutePath);

                if (stats.isDirectory()) {
                    return { id: absolutePath, name: file, isDir: true };
                } else {
                    return { id: gitFilePath, name: file, color: color_Default };
                }
            } else {
                return null;
            }
        });

        const promiseMatrix = await Promise.all(gitSpaceMatrix);
        const finalResultMatrix = resultMatrix.concat(promiseMatrix.filter(Boolean));
        callback(null, finalResultMatrix);

    } catch (err) {
        console.error('readGit error :', err);
    }
}


const getCurrentBranch = async (rootPath) => {
    const branchname = await git.currentBranch({ fs, dir: rootPath, fullname: false });

    return branchname;
}

module.exports = { readGitStatus, getCurrentBranch, GitDelete, GitRename, GitRestore, GitUntrack };