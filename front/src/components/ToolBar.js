import styles from '../css/ToolBar.module.css';
import NavButton from './NavButton';
import React from 'react';

function ToolBar(){

    return (<>
    <div className={styles.toolbarBody}>

        <div id={styles.lBox} className={styles.box}>
        <NavButton nav={"filter"}/>
        </div>

        <div id={styles.logoBox}>
            <NavButton nav={"logo"}/>
        </div>

        <div id={styles.rBox} className={styles.box}>
        <NavButton nav={"post"}/>
        <NavButton nav={"library"}/>
        <NavButton nav={"more"}/>
        </div>
    </div>
    </>);
}

export default ToolBar;