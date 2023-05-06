import React, { useState ,useEffect, useRef } from 'react';
import './file-explorer/file-explorer.css';
const { ipcRenderer } = window.require('electron');

function FileMangement() {
  const id = 'filemanager'; // getting id when components change to Filemangement(id) to feature support "switching"
  const getDirInfo = async (dirPath, callback) => {
    try {
      const result = await ipcRenderer.invoke('ReadDir', dirPath);
      callback(result);
    } catch (err) {
      console.error('Error reading directory info:', err);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = './file-explorer/file-explorer.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const elem = document.getElementById(id);
      const options = {
        initpath: [['.', '/']],
        onfocus: function (e) {
          console.log('focus');
          console.log(e);
        },
        onblur: function (e) {
          console.log('blur');
          console.log(e);
        },
        onrefresh: function (folder, required) {
          const PathArr = folder.GetPath().at(-1);
          console.log(PathArr);
          var dirPath = '';
          for(var i = 0; i < PathArr.length - 1; i++){
            dirPath = dirPath + PathArr[i];
          }
          console.log(dirPath);
          getDirInfo(dirPath, (contents) => {
            console.log('Directory Elements:' , contents);
            console.log('Directory Path:',folder.GetPath());
            folder.SetEntries(contents);
          });
         
        },
      };
      const fe = new window.FileExplorer(elem, options);
      const folder = fe.GetCurrentFolder();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id={id}
      style={{
        height: '50vh',
        maxHeight: '400px',
        position: 'relative',
      }}
    ></div>
  );
}

export default FileMangement;
