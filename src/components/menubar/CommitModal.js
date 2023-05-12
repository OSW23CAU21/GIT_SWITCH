import React, { useState } from 'react';
import './modal.css';
const CommitModal = ({ SetOpenModal }) => {
  //커밋 메시지 작성하지 않았을시 커밋 불가
  //commit 버튼 눌렀을시 main에게 send
  //commit 버튼 누르면 창 꺼짐
  //커밋하면 staged 파일 어디로,,
  //뒷배경 overlay
  const [commit, SetCommit] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
  };
  return (
    <section className="container">
      <div>
        <h3>commit</h3>
      </div>
      <button onClick={SetOpenModal(false)}>x</button>
      <form className="modal__content" onSubmit={handleSubmit}>
        <input
          className="input__box"
          type="text"
          placeholder="message"
          name="commit"
          value={commit}
          onChange={SetCommit}
        />
        <button>확인</button>
      </form>
    </section>
  );
};

export default CommitModal;
