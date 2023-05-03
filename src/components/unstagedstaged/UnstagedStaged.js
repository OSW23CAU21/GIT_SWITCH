import React from 'react';
import FileList from './FileList';

const UnstagedStaged = () => {
  return (
    <>
      <div>Staged 컴포넌트 입니다.</div>
      <FileList />

      <div>Unstaged 컴포넌트 입니다.</div>
      <FileList />
    </>
  );
};

export default UnstagedStaged;
