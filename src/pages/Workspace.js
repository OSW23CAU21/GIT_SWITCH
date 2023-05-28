import React from 'react';
import Menubar from '../components/menubar/Menubar';
import UnstagedStaged from '../components/unstagedstaged/UnstagedStaged';
import FileManagement from '../components/filemanagement/FileManagement';

const Workspace = () => {
  return (
    <div>
      <Menubar />
      <FileManagement />
      <UnstagedStaged />
    </div>
  );
};

export default Workspace;
