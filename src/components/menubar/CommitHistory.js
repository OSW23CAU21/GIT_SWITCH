import { useState, useEffect } from 'react';
import { Gitgraph } from '@gitgraph/react';
import { Orientation } from '@gitgraph/core';
const { ipcRenderer } = window.require('electron');

function GitCommitHistory({infoOpen, infoClose, setCommitInfo}) {
    const [commits, setCommits] = useState(null);
  
    const mouseOn = (oid) => () => {
        setCommitInfo(`OID: ${oid}`);
        infoOpen();
    }
  
    const mouseOut = () => {
      infoClose();
    }
  
    useEffect(() => {
      (async function getLog() {
        const commitData = await ipcRenderer.invoke('GH_gethistory');
        setCommits(commitData);
      })();
    }, []);
  
    if (!commits) {
      return <div>Loading...</div>;
    }
  
    return (
      <div style={{
        transform: 'scale(0.9)',
        transformOrigin: 'top left',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        paddingRight: ''
      }}>
        <Gitgraph options={{ orientation: Orientation.VerticalReverse }}>
          {(gitgraph) => {
            const master = gitgraph.branch("master");
            commits.forEach((commit, index) => {
              master.commit({
                subject: commit.commit.message,
                hash: commit.oid,
                author: commit.commit.author.name,
                onMouseOver: mouseOn(commit.oid),
                onMouseOut: mouseOut
              });
            });
          }}
        </Gitgraph >
      </div>
    );
  }
  
  export default GitCommitHistory;
  