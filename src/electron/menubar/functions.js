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

  module.exports = {gitInit}