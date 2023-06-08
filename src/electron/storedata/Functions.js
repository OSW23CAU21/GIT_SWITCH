const Store = require('electron-store');

const storage = new Store;

async function storePath(rootPath) {
    storage.set('BasePath', rootPath);
}

async function storeToken(accessToken) {
    storage.set('Token', accessToken);
}

async function storeAuthor(authorName, authorEmail) {
    const AuthorInfo = {
        name: authorName,
        email: authorEmail,
    };

    storage.set('AuthorInfo', AuthorInfo);
}

async function callPath() {
    let loadedpath = storage.get('BasePath');
    if (loadedpath != undefined) {
        return loadedpath;
    } else {
        return '';
    }
}

async function callToken(){
    let token = storage.get('Token');
    if (token != undefined) {
        return token;
    } else {
        return '';
    }
}

async function callAuthor() {
    let AuthorInfo = storage.get('AuthorInfo');
    if (AuthorInfo != undefined) {
        return AuthorInfo;
    } else {
        return {name: '', email: ''};
    }
}

module.exports = { storePath, callPath, storeToken, callToken, storeAuthor, callAuthor };