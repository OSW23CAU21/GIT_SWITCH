const git = require('isomorphic-git'); // importing Isomorpihic git.
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const Store = require('electron-store');

const storage = new Store;

const commitStatus = async () => {
  const matrix = await git.statusMatrix({ fs, dir : storage.get('BasePath')});

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

const gitCommit = async (commitMessage, authorName, authorEmail) => {
  try {
    let sha = await git.commit({
      fs,
      dir: storage.get('BasePath'),
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


async function gitClone(githuburl, accessToken) {
  return new Promise(async (resolve, reject) => {
    try {
      await git.clone({
        fs,
        http,
        dir:  storage.get('BasePath'),
        corsProxy: 'https://cors.isomorphic-git.org',
        url: githuburl,
        onAuth: () => ({ username: accessToken }),
      });
      resolve({result : true, message : `Cloned ${githuburl} successfully`});
    } catch (err) {
      resolve({result : false, message : `Error during clone: ${err.message}`});
    }
  });
}

module.exports = { commitStatus, gitCommit, gitClone };