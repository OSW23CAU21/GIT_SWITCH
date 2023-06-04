const fs = require('fs');
const path = require('path');

//for gitManaging
async function del(file){
  fs.unlink(file, function(err){
    if(err) {
      console.log("Error : ", err)
    }
  })
};

//for gitManaging
async function rename(original, target){
  fs.rename(original, target, function (err) {
    if (err) throw err;
    console.log('File Renamed!');
  }); 
};

//for Flmngr :  
const readDirInfo = (currentPath, callback) => {
  fs.readdir(currentPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      callback(err, null);
      return;
    }

    const DirContents = [];

    files.forEach((file) => {
      const filePath = path.join(currentPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        let fileInfo;
        if(stats.isDirectory()){
          fileInfo = {
            id: path.resolve(filePath),
            name: file,
            isDir: true ,
          };
        }else if (stats.isFile()){
          fileInfo = {
            id: path.resolve(filePath),
            name: file,
            color: '#e6e6e6',
          };
        }
        DirContents.push(fileInfo);

        if (DirContents.length === files.length) {
          callback(null, DirContents);
        }
      });
    });
  });
};

const getFolderChain = (DirectoryPath) => {
  return [path.resolve(DirectoryPath), path.basename(path.resolve(DirectoryPath))];
} 
module.exports = {readDirInfo, getFolderChain};
