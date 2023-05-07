import React from 'react';
import Menubar from '../components/menubar/Menubar';
import UnstagedStaged from '../components/unstagedstaged/UnstagedStaged';
import FileMangement from '../components/filemangement/FileMangement';

const Workspace = () => {
  return (
    <div>
      <Menubar />
      <FileMangement />
      <UnstagedStaged />
    </div>
  );
};

export default Workspace;
