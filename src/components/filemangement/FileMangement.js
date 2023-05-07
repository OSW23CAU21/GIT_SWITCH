import React, {useEffect} from 'react';
import './file-explorer/file-explorer.css';
const { ipcRenderer } = window.require('electron');

const getDirInfo = async (dirPath, callback) => {
  try {
    const result = await ipcRenderer.invoke('ReadDir', dirPath);
    callback(result);
  } catch (err) {
    console.error('Error reading directory info:', err);
  }
};

function FileMangement() {
  const id = 'filemanager'; // getting id when components change to Filemangement(id) to feature support "switching"

  useEffect(() => {
    const script = document.createElement('script');
    script.src = './file-explorer/file-explorer.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const elem = document.getElementById(id);
      const options = {
        initpath: [['./', '', { canmodify: false } ]],
        onrefresh: function (folder, required) {
          const PathArr = folder.GetPath().at(-1);
          var dirPath = PathArr[0]
          getDirInfo(dirPath, (contents) => {
            folder.SetEntries(contents);
          });    
        },
      };
      const fe = new window.FileExplorer(elem, options);
      fe.removeEventListener();
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

