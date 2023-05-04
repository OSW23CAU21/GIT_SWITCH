import React from 'react';
import FileList from './FileList';

/**
 * For untracked files:
 *  Adding the new files into a staging area (untracked -> staged; git add)
 *  For modified files
 *  Adding the modified files into a staging area (modified -> staged; git add)
 *  Undoing the modification (modified -> unmodified; git restore)
 *  For staged files
 * Unstaging changes (staged -> modified or untracked; git restore --staged)
 *  For committed or unmodified files
 *  Untracking files (committed -> untracked; git rm --cached)
 *  Deleting files (committed -> staged; git rm)
 *  Renaming files (committed -> staged; git mv)
 */

const files = [
    { name: 'file1.txt' },
    { name: 'file2.txt' },
    { name: 'file3.txt' },
];


const UnstagedStaged = () => {
  return (
    <>
      <div>Staged 컴포넌트 입니다.</div>
      <FileList files={files}/>

      <div>Unstaged 컴포넌트 입니다.</div>
      <FileList files={files}/>
    </>
  );
};

export default UnstagedStaged;
