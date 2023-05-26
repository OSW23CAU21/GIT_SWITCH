const git = require('isomorphic-git'); // importing Isomorpihic git.
const fs = require('fs');


const GetGitStatus = async (rootPath, callback) => {
    let GitMatrix;
    try{
      GitMatrix = await  git.statusMatrix({ fs, dir : rootPath});
    }catch{
      console.log('error to get GitMatrix');
    }
    const StageMatrix = [];
    let FileStatus;
    for(const [filePath, HeadStatus, WorkdirStatus, StageStatus] of GitMatrix){
      FileStatus = [];
      if (HeadStatus === 0 && WorkdirStatus === 2) { // untracked, added
        FileStatus = {name : filePath, staged : true, status : 'untracked'}
        if(StageStatus == 2){
          FileStatus.staged = false;
          FileStatus.status = 'added';
        } else if(StageStatus == 3){
          FileStatus.status = 'added';
          StageMatrix.push(FileStatus);
          FileStatus.staged = false;
        }
      } else if (HeadStatus === 1 && WorkdirStatus === 0) {// deleted
        FileStatus = {name : filePath, staged : true, status : 'deleted'}
        if(StageStatus == 1){
          FileStatus.staged = false;
        }
      } else if (HeadStatus === 1 && WorkdirStatus === 2) { // modified
        FileStatus = {name : filePath, staged : false, status : 'modified'}
        if(StageStatus == 1){
          FileStatus.staged = true;
        }
      } else {
        continue;
      }
      StageMatrix.push(FileStatus);
    }
    callback(null, StageMatrix);
};

module.exports = {GetGitStatus};