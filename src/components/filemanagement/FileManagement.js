import React, { useState, useEffect, useCallback } from 'react';
import {Tabs, Tab} from "@mui/material"
import WorkSpaceBrowser from './WorkSpaceBrowser';
import GitBrowser from './GitSpaceBrowser';

const Styles = {
    tabs:{
        backgroundColor: '#404040',
    },
    tab1: {
        backgroundColor: '#404040',
        color: '#ffffff',
    },
    tab2: {
        backgroundColor: '#404040',
        color: '#ffffff',
    },
};

const FileManagement = () =>{
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <div>
            <Tabs sx={Styles.tabs} value={activeTab} onChange={handleTabChange}>
                <Tab sx = {Styles.tab1} label="WorkSpace" />
                <Tab sx = {Styles.tab2} label="GitSpace" />
            </Tabs>
            {activeTab === 0 && <WorkSpaceBrowser />}
            {activeTab === 1 && <GitBrowser />}
        </div>
    );
}

export default FileManagement;