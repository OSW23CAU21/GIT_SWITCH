import { useState, useEffect } from 'react';
import react from 'react';
import CommitFab from './CommitFab';
import MergeFab from './MergeFab';
import BranchFab from './BranchFab';
import RefreshFab from './RefreshFab';

const { ipcRenderer } = window.require('electron');

const GitFab = () => {
    return (
        <div>
            <RefreshFab />
            <MergeFab />
            <BranchFab />
            <CommitFab />
        </div>
    );
}


export default GitFab