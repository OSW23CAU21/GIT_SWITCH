const git = require('isomorphic-git');
const fs = require('fs');
const diff = require('diff');
const { TextDecoder } = require('util');

let decoder = new TextDecoder("utf-8");

const getCurrentBranch = async (rootPath) => {
    const branchname = await git.currentBranch({ fs, dir: rootPath, fullname: false });
    return branchname;
}

async function getCurrentOid(rootPath) {
    const ref = await getCurrentBranch(rootPath);
    const sha = await git.resolveRef({ fs, dir: rootPath, ref: ref });
    return sha;
}

async function getGitDiff(rootPath, filePath, newOid, oldOid) {
  // Get the new version of the file
  let newContent;
  try {
    if (newOid) {
        let { blob } = await git.readBlob({
          fs,
          dir: rootPath,
          oid: newOid,
          filepath: filePath,
        });
        if(!blob){
            return 'something gonna wrong to read new contents from git.'
        }
        newContent = decoder.decode(blob);
      } else {
        newOid = 'Current File'
        newContent = fs.readFileSync(`${rootPath}/${filePath}`, 'utf8');
      }
  } catch (err) {
    console.error('Error reading new version of file:', err);
    return null;
  }

  // Get the old version of the file
  let oldContent;
  try {
    let { blob } = await git.readBlob({
      fs,
      dir: rootPath,
      oid: oldOid,
      filepath: filePath,
    });
    if(!blob){
        return 'something gonna wrong to read old contents from git.'
    }
    oldContent = decoder.decode(blob);
  } catch (err) {
    console.error('Error reading old version of file:', err);
    return null;
  }

  // Compare the two versions of the file and generate a diff
  const fileDiff = diff.createPatch(filePath, oldContent, newContent, oldOid, newOid);
  return fileDiff;
};

async function diffRead(rootPath, filePath){
    const currentOid = await getCurrentOid(rootPath);
    const fileDiff = await getGitDiff(rootPath, filePath, null, currentOid);
    return fileDiff;
}

module.exports = {diffRead};
