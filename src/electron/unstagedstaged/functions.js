const git = require('isomorphic-git'); // importing Isomorpihic git.
const fs = require('fs');


const GetGitStatus = async (rootPath, callback) => {
  let GitMatrix;
  let isGit;
  let FileStatus;
  const StageMatrix = [];
  
  try {
    GitMatrix = await git.statusMatrix({ fs, dir: rootPath });
    isGit = await git.resolveRef({ fs, dir: rootPath, ref: 'HEAD' });
  } catch {
    console.log('error to get GitMatrix');
  }
  if (isGit === undefined) {
    callback(null, []);
  }

  for (const [filePath, HeadStatus, WorkdirStatus, StageStatus] of GitMatrix) {
    FileStatus = [];
    if (HeadStatus === 0 && WorkdirStatus === 2) { // untracked, added
      FileStatus = { name: filePath, staged: true, status: 'untracked',root : rootPath }
      if (StageStatus === 2) {
        FileStatus.staged = false;
        FileStatus.status = 'added';
      } else if (StageStatus === 3) {
        FileStatus.status = 'added';
        StageMatrix.push({...FileStatus});
        FileStatus.staged = false;
      }
    } else if (HeadStatus === 1 && WorkdirStatus === 0) {// deleted
      FileStatus = { name: filePath, staged: true, status: 'deleted' , root :  rootPath }
      if (StageStatus === 0) {
        FileStatus.staged = false;
      }
    } else if (HeadStatus === 1 && WorkdirStatus === 2) { // modified
      FileStatus = { name: filePath, staged: false, status: 'modified', root: rootPath }
      if (StageStatus === 1) {
        FileStatus.staged = true;
      } else if (StageStatus === 3) {
        StageMatrix.push({...FileStatus});
        FileStatus.staged = true;
      }
    } else { // modified 1.1.1  or something.
      continue;
    }
    StageMatrix.push({...FileStatus});
  }
  callback(null, StageMatrix);
};

const gitAdd = (SelectedFiles, length) => {
  return new Promise(async (resolve, reject) => {
    try{
      for (let i = 0; i < length; i++) {
        if (SelectedFiles[i].staged == true) {
          if(SelectedFiles[i].status === 'deleted'){
            await git.remove({ fs, dir: SelectedFiles[i].root, filepath: SelectedFiles[i].name });
          }else{
            await git.add({ fs, dir: SelectedFiles[i].root, filepath: SelectedFiles[i].name });
          }
        } else {
          await git.resetIndex({ fs, dir: SelectedFiles[i].root, filepath: SelectedFiles[i].name });
        }
      } resolve();
    }catch{
      reject();
    }
  });
};

module.exports = { GetGitStatus, gitAdd };