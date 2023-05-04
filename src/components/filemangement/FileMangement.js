import React, { useEffect, useRef } from 'react';
import './file-explorer/file-explorer.css';

function FileMangement() {
  const id = 'filemanager'; // getting id when components change to Filemangement(id) to feature support "switching"
  const osw23 = [ // folder array, test only
    { name: 'src', type: 'folder', id: '/', hash: '/' },
    { name: 'README.MD', type: 'file', id: '/', hash: '/' },
    { name: 'package.json', type: 'file', id: '/', hash: '/' },
  ];
  const src = [ // folder array, test only
    { name: 'index.css', type: 'file', id: 'src', hash: 'src' },
    { name: 'app.js', type: 'file', id: 'src', hash: 'src' },
    { name: 'index.js', type: 'file', id: 'src', hash: 'src' },
  ];
  useEffect(() => {
    const script = document.createElement('script');
    script.src = './file-explorer/file-explorer.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const elem = document.getElementById(id);
      const options = {
        initpath: [['', 'Projects (/)', { canmodify: false }]],
        onfocus: function (e) {
          console.log('focus');
          console.log(e);
        },
        onblur: function (e) {
          console.log('blur');
          console.log(e);
        },
        onrefresh: function (folder, required) {// rerendering filebox.
        },
      };
      const fe = new window.FileExplorer(elem, options);
      const folder = fe.GetCurrentFolder();
      folder.SetEntries(src); //getting folder array "src" for test.
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id={id}
      style={{
        height: '50vh',
        maxHeight: '400px',
        position: 'relative',
      }}
    ></div>
  );
}

export default FileMangement;
