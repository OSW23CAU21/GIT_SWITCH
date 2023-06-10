import { useState, useEffect } from 'react';
import { Gitgraph } from '@gitgraph/react';
import { Orientation } from '@gitgraph/core';

function GitCommitHistory({ commits, infoOpen, infoClose, setCommitInfo }) {

  

  const mouseOn = (commit, author, oid) => () => {
    console.log(commit);
    let date = new Date(author.timestamp);
    setCommitInfo(`AUTHOR NAME : ${author.name} \n AUTHOR EMAIL : ${author.email}\n MESSAGE:${commit.commit.message} OID: ${oid} \n Commit Time: ${date} `);
    infoOpen();
  }

  const mouseOut = () => {
    infoClose();
  }


  if (!commits) {
    return <div>Loading...</div>;
  }

  const graphOptions = {
    transform: 'scale(0.9)',
    transformOrigin: 'top left',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    paddingRight: '',
  }


  return (
    <div style={graphOptions}>
      <Gitgraph options={{ orientation: Orientation.VerticalReverse }}>
        {(gitgraph) => {
          const master = gitgraph.branch("master");
          commits.forEach((commit, index) => {
            master.commit({
              subject: commit.commit.message,
              hash: commit.oid,
              author: commit.commit.author.name,
              onMouseOver: mouseOn(commit, commit.commit.author, commit.oid),
              onMouseOut: mouseOut
            });
          });
        }}
      </Gitgraph >
    </div>
  );
}

export default GitCommitHistory;
