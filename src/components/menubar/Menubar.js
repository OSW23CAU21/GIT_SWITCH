import React from 'react';
const { ipcRenderer } = window.require('electron');

const setDirButtonClick = async () => {
  const rootPath = await ipcRenderer.invoke('getRoot');
  console.log(rootPath);
};

const gitInitButtonClick = async () => {
  console.log('gitInit');
};

const commitButtonClick = async () => {
  console.log('commit');
};

const Menubar = () => {
  return (
    <div>
      <button onClick={setDirButtonClick}>setDir</button>
      <button onClick={gitInitButtonClick}>gitInit</button>
      <button onClick={commitButtonClick}>commit</button>
    </div>
  );
};

export default Menubar;
