import styles from '../css/ToolBar.module.css';

import React from 'react';
import { Link } from 'react-router-dom';

function ToolBar(){

    return (<>
    <div className={styles.toolbarBody}>
        <NavButton nav={"library"}/>
        <NavButton nav={"profile"}/>
        <Link to="/WritePage">
            <button>글쓰기</button>
        </Link>
    </div>
    </>);
}

export default ToolBar;