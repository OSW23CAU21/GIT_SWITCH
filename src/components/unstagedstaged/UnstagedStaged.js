import React, { useState, useEffect } from 'react';
import FileList from './FileList';
import styled from 'styled-components';
const { ipcRenderer } = window.require('electron');

const getDirInfo = async (CurrentPath, callback) => { //getting FileInfo from backend "main.js" using electron.
  try {
    const result = await ipcRenderer.invoke('GitStatus', CurrentPath);
    callback(result);
  } catch (err) {
    console.error('Error reading directory info:', err);
  }
};

const initialFiles = [];

const UnstagedStaged = () => {
  const [files, setFiles] = useState(initialFiles);
  const [CurrentPath, setCurrentPath] = useState('');
  useEffect(() => {
    ipcRenderer.on('CurrentPathChanged', (_, newCurrentPath) => {
      //console.log('newCurrentPath :', newCurrentPath);
      setCurrentPath(newCurrentPath);
    });
    return () => {
      ipcRenderer.removeAllListeners('CurrentPathChanged');
    };
  }, []);
  
  useEffect (() => {
    //console.log('getDirInfo :', CurrentPath);
   getDirInfo(CurrentPath, (contents) => {
      setFiles(contents);
    }); 
  }, [CurrentPath]);
   
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
    background: #FF0044;
    color:white;
text-align:right;
   }
   .unstaged-content{
    height:300px;
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
    
    height:300px;
    background:white;
   }
  `;
  return (
    <Container>
      <Staged>
        <div className="staged-content">
          <h3>Staged</h3>
          <FileList
            files={files.filter(file => !file.staged)}
            onFileSelect={selectedFiles =>
                handleFileSelect(selectedFiles, true)
            }
            buttonName="To Unstaged"
          />
        </div>
      </Staged>
      <Unstaged>
        <div className="unstaged-content">
          <h3>Unstaged</h3>
          <FileList
            files={files.filter(file => file.staged)}
            onFileSelect={selectedFiles =>
              handleFileSelect(selectedFiles, false)
            }
            buttonName="To Staged"
          />
        </div>
      </Unstaged>
    </Container>
  );
};

export default UnstagedStaged;