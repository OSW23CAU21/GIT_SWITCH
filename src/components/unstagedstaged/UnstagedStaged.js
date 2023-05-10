import React, { useState, useEffect } from 'react';
import FileList from './FileList';
import styled from 'styled-components';
const { ipcRenderer } = window.require('electron');
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

const getDirInfo = async callback => { //getting FileInfo from backend "main.js" using electron.
  try {
    const result = await ipcRenderer.invoke('getGitStat');
    callback(result);
  } catch (err) {
    console.error('Error reading directory info:', err);
  }
};

const initialFiles = [];

const UnstagedStaged = () => {
  const [files, setFiles] = useState(initialFiles);
  const [relPath, setRelPath] = useState('');
  useEffect(() => {
    ipcRenderer.on('RelPathChanged', (_, newRelPath) => {
      console.log('newRelPath')
      setRelPath(newRelPath);
    });
    return () => {
      ipcRenderer.removeAllListeners('relPathChanged');
    };
  }, []);
  
  useEffect (() => {
    getDirInfo((contents) => {
      setFiles(contents);
    }); 
  }, [relPath]);
   
  const handleFileSelect = (selectedFiles, staged) => {
    const updatedFiles = files.map(file =>
      selectedFiles.includes(file) ? { ...file, staged } : file
    );
    setFiles(updatedFiles);
  };
  const Container = styled.div`
    display: flex;
  `;
  const Unstaged = styled.div`
width:500px;;
   overflow-hidden;
   margin:1rem 1rem;
   padding:1rem;   
   h3{
    padding-right:10px;
    background: #0052CC;
    color:white;
text-align:right;
   }
   .unstaged-content{
    height:400px;
    background:white;
   }
  `;
  const Staged = styled.div`
  width:500px;
  overflow-hidden;
  border-radius:10px;
  margin:1rem 1rem;
   padding:1rem;   
  h3{
    padding-right:10px;
   background: #0052CC;
   color:white;
   text-align:right;
  }
  .staged-content{
    
    height:400px;
    background:white;
   }
  `;
  return (
    <Container>
      <Unstaged>
        <div className="unstaged-content">
          <h3>Unstaged</h3>
          <FileList
            files={files.filter(file => file.staged)}
            onFileSelect={selectedFiles =>
              handleFileSelect(selectedFiles, false)
            }
          />
        </div>
      </Unstaged>
      <Staged>
        <div className="staged-content">
          <h3>staged</h3>
          <FileList
            files={files.filter(file => !file.staged)}
            onFileSelect={selectedFiles =>
              handleFileSelect(selectedFiles, true)
            }
          />
        </div>
      </Staged>
    </Container>
  );
};

export default UnstagedStaged;