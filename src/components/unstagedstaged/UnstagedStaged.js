import React, { useState, useEffect } from 'react';
import FileList from './FileList';
import styled from 'styled-components';
import GitBrowser from '../filemanagement/GitSpaceBrowser';
const { ipcRenderer } = window.require('electron');

const getDirInfo = async (CurrentPath, callback) => { //getting FileInfo from backend "main.js" using electron.
  try {
    const result = await ipcRenderer.invoke('SUS_GitStatus', CurrentPath);
    callback(result);
  } catch (err) {
    console.error('Error reading directory info:', err);
  }
};

const initialFiles = [];

const UnstagedStaged = () => {
  const [files, setFiles] = useState(initialFiles);
  const [rootPath, setRootPath] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    ipcRenderer.on('RootPathChanged', (_, newRootPath) => {
      setRootPath(newRootPath);
    });
    return () => {
      ipcRenderer.removeAllListeners('RootPathChanged');
    };
  }, []);

  useEffect(() => {
    ipcRenderer.on('Refresh_SUS', (_) => {
      refresh();
    });
    return () => {
      ipcRenderer.removeAllListeners('Refresh_SUS');
    };
  }, [])

  useEffect(() => {
    async function fetchBasePath() {
      const basePath = await ipcRenderer.invoke('SD_callpath');
      setRootPath(basePath);
    }

    fetchBasePath();
  }, []);




  useEffect(() => {
    getDirInfo(rootPath, (contents) => {
      setFiles(contents);
    });
  }, [rootPath, refreshKey]);

  const refresh = () => {
    setRefreshKey(prevrefreshKey => prevrefreshKey + 1);
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
    background: #99c2ff;
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
            onFileSelect={refresh}
            buttonName="To Unstaged"
          />
        </div>
      </Staged>
      <Unstaged>
        <div className="unstaged-content">
          <h3>Unstaged</h3>
          <FileList
            files={files.filter(file => file.staged)}
            onFileSelect={refresh}
            buttonName="To Staged"
          />
        </div>
      </Unstaged>
    </Container>
  );
};

export default UnstagedStaged;