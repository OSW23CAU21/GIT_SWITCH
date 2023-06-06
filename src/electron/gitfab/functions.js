const git = require('isomorphic-git'); // importing Isomorpihic git.
const fs = require('fs');

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
    } else if (HeadStatus === 1 && WorkdirStatus === 2 && StageStatus > 1) {
      // Modified file
      status.modified.push(filepath);
    }
  }
  console.log('status : ', status);
  return status;
};

const gitCommit = async (rootPath, commitMessage, authorName, authorEmail) => {
  try {
    let sha = await git.commit({
      fs,
      dir: rootPath.rootPath,
      author: {
        name: authorName,
        email: authorEmail
      },
      message: commitMessage
    });
    console.log('committed :', sha);
    return true;
  } catch (err) {
    console.error('commit error : ', err );
    return false;
  }
};

module.exports = { commitStatus, gitCommit };