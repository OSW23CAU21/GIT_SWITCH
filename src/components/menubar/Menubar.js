import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

const { exec } = require('child_process');

const gitInitButtonClick = async () => {
  const gitInit = await ipcRenderer.invoke('gitInit'); 
  console.log('gitInit');
}
const Menubar = () => {
  //const [commitMessage, setCommitMessage] = useState('');

  const setDirButtonClick = async () => {
    const rootPath = await ipcRenderer.invoke('getRoot');
    console.log(rootPath);
  };

  const gitInitButtonClick = async () => {
    const rootPath = await ipcRenderer.invoke('getRoot');
    exec('git init', { cwd: rootPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  };

  const commitButtonClick = async () => {
    const modifiedFiles = await ipcRenderer.invoke('getModifiedFiles');
    const commitMsg = window.prompt('Enter commit message:', '');
    if (commitMsg !== null) {
      const commitCmd = `git commit -m "${commitMsg}" ${modifiedFiles.join(
        ' '
      )}`;
      exec(commitCmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
    }
  };

  return (
    <div>
      <button onClick={setDirButtonClick}>setDir</button>
      <button onClick={gitInitButtonClick}>gitInit</button>
      <button onClick={commitButtonClick}>commit</button>
    </div>
  );
};

export default Menubar;
