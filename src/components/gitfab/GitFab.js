import react from 'react';
import CommitFab from './CommitFab';
import PullFab from './PullFab';
import PushFab from './PushFab';

const GitFab = () => {
    return(
        <div>
            <PullFab/>
            <PushFab/>
            <CommitFab/>
        </div>
    );
}


export default GitFab