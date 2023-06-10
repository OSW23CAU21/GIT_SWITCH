const git = require('isomorphic-git'); // importing Isomorpihic git.
const fs = require('fs');
const store = require('electron-store');

const storage = new store;

// branch creation
async function createBranch(branchName) {
    const rootPath = storage.get('BasePath');
    try {
        await git.branch({ fs, dir: rootPath, ref: branchName });
        console.log(`Branch '${branchName}' created.`);
        return ({ result: true, message: `Branch '${branchName}' is created.` })
    } catch (err) {
        return ({ result: false, message: err });
    }
}

// branch deletion
async function deleteBranch(branchName) {
    const rootPath = storage.get('BasePath');
    try {
        await git.deleteRef({ fs, dir: rootPath, ref: `refs/heads/${branchName}` });
        console.log(`Branch is '${branchName}' deleted.`);
        return ({ result: true, message: `Branch '${branchName}' is deleted.` })
    } catch (err) {
        return ({ result: false, message: err });
    }
}

// branch Rename
async function renameBranch(oldName, newName) {
    const rootPath = storage.get('BasePath');
    try {
        const commitOid = await git.resolveRef({ fs, dir: rootPath, ref: `refs/heads/${oldName}` });
        await git.deleteRef({ fs, dir: rootPath, ref: `refs/heads/${oldName}` });
        await git.writeRef({ fs, dir: rootPath, ref: `refs/heads/${newName}`, value: commitOid });
        console.log(`Branch '${oldName}' renamed to '${newName}'.`);
        return ({ result: true, message: `Branch '${oldName}' renamed to '${newName}'.` })
    } catch (err) {
        return ({ result: false, message: err });
    }
}

// branch checkout
async function checkoutBranch(branchName) {
    const rootPath = storage.get('BasePath');
    try {
        await git.checkout({ fs, dir: rootPath, ref: branchName });
        console.log(`Checked out branch '${branchName}'.`);
        return ({ result: true, message: `Checked out to '${branchName}'.` })
    } catch (err) {
        return ({ result: false, message: err });
    }
}

module.exports = { createBranch, deleteBranch, renameBranch, checkoutBranch };
