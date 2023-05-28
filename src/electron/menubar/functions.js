const git = require('isomorphic-git'); // importing Isomorpihic git.
const fs = require('fs');


const gitInit = async (currPath) => {
    try {
      await git.resolveRef({ fs, dir: currPath, ref: 'HEAD' });
      console.log('This repository is already initialized.');
      return true;
    } catch (err) {
      await git.init({ fs, dir: currPath});
      console.log('Repository initialized.');
      sendRootChanged(currPath);
      return false;
    }
  };

const commitStatus = async (dir) => {
    const matrix = await git.statusMatrix({ fs, dir });
  
    const status = {
      new: [],
      modified: [],
      deleted: []
    };
  
    for (const [filepath, HeadStatus, WorkdirStatus, StageStatus] of matrix) {
      if (HeadStatus === 0 && WorkdirStatus === 2 && StageStatus > 1) {
        // New file
        status.new.push(filepath);
      } else if (HeadStatus === 1 && WorkdirStatus === 0 && StageStatus === 0) {
        // Deleted file
        status.deleted.push(filepath);
      } else if (HeadStatus === 1 && WorkdirStatus === 2 && StageStatus > 1 ) {
        // Modified file
        status.modified.push(filepath);
      }
    }
    console.log('status : ', status);
    return status;
  };
  
  const gitCommit = async(commitMessage, authorName, authorEmail) => {
    let sha = await git.commit({
      fs,
      dir: RootPath,
      author: {
        name : authorName,
        email : authorEmail
      },
      message : commitMessage
    });
    console.log('committed :', sha);
    return sha;
  };

  module.exports = {commitStatus, gitCommit, gitInit}