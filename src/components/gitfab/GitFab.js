import { useState, useEffect } from 'react';
import react from 'react';
import CommitFab from './CommitFab';
import MergeFab from './MergeFab';
import BranchFab from './BranchFab';
import RefreshFab from './RefreshFab';

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
            <RefreshFab />
            <MergeFab />
            <BranchFab />
            <CommitFab rootPath = {rootPath}/>
        </div>
    );
}


export default GitFab