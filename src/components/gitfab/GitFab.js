import { useState, useEffect } from 'react';
import react from 'react';
import CommitFab from './CommitFab';
import PullFab from './PullFab';
import PushFab from './PushFab';

const { ipcRenderer } = window.require('electron');

const GitFab = () => {
    const [rootPath, setRootPath] = useState('');
    useEffect(() => {
        ipcRenderer.on('RootPathChanged', (_, newRootPath) => {
            setRootPath(newRootPath);
        });
        return () => {
            ipcRenderer.removeAllListeners('RootPathChanged');
        };
    }, []);

    return (
        <div>
            <PullFab />
            <PushFab />
            <CommitFab rootPath = {rootPath}/>
        </div>
    );
}


export default GitFab