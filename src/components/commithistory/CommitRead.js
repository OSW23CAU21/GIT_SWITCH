import { commit } from 'isomorphic-git';
import React, { useState } from 'react';
//commitRead components
const CommitRead = () => {
  const [commitCheck, setCommitCheck] = useState({
    oid: '70af1cf275519905546cf3a953fa8f60e03dbd50',
    commit: {
      message: 'merge branch',
      parent: [
        '370a9b1a0e2815fce116044dda3dd39dec8f3dc0',
        '507a13b37c5c4ba6e8d24fdf5d58cc042257b7fa',
      ],
      tree: 'fe22f8bca344f49094d43d0b164a3d89e0adfcb0',
      author: {
        name: 'jjgene',
        email: '108653152+jjgene@users.noreply.github.com',
        date: '2023-05-18',
      },
    },
  });
  return (
    <section>
      <h2>Commit 정보</h2>
      <p>OID: {commitCheck.oid}</p>
      <p>메시지: {commitCheck.commit.message}</p>
      <p>부모 커밋:</p>
      <ul>
        {commitCheck.commit.parent.map((parentCommit, index) => (
          <li key={index}>{parentCommit}</li>
        ))}
      </ul>
      <p>트리: {commitCheck.commit.tree}</p>
      <p>작성자: {commitCheck.commit.author.name}</p>
      <p>이메일: {commitCheck.commit.author.email}</p>
      <p>날짜: {commitCheck.commit.author.date}</p>
    </section>
  );
};

export default CommitRead;
