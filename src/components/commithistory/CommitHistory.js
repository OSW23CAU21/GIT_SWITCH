import React, { useState } from 'react';
import './commithist.css';
import CommitRead from './CommitRead';
const CommitHistory = () => {
  const handleClick = sha => {};
  const [logs, SetLogs] = useState([
    {
      oid: 'efwea323vdzd',
      message: 'third commit',
      author: 'MJ',
      date: '2022-05-26',
      sha: 'sdfsefwef',
    },
    {
      oid: 'wefwl3234sdf',
      message: 'second commit',
      author: 'MJ',
      date: '2022-05-24',
      sha: 'aefdfsdffe',
    },
    {
      oid: '329adklnfs3r',
      message: 'first commit',
      author: 'MJ',
      date: '2022-05-20',
      sha: 'aegfmlfms',
    },
  ]);
  return (
    <div className="commit__hist_container">
      <div className="commit__hist_table_container">
        <table className="commit__hist_table">
          <thead>
            <tr>
              <th>Graph</th>
              <th>Message</th>
              <th>Author</th>
              <th>Date</th>
              <th>Sha</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr
                className="commit__hist_tr"
                key={log.oid}
                onClick={() => {
                  handleClick(log.oid);
                }}
              >
                <td>graph</td>
                <td>{log.message}</td>
                <td>{log.author}</td>
                <td>{log.date}</td>
                <td>{log.sha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="commit__read_container">
        <div className="checkcommit__container">
          <CommitRead />
        </div>
        <div>Filediff</div>
      </div>
    </div>
  );
};

export default CommitHistory;
