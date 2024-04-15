import styles from '../css/ToolBar.module.css';
import NavButton from './NavButton';
import React from 'react';



function ToolBar(){
    
    return (<>
    <div className={styles.toolbarBody}>

        {/*툴바의 왼쪽 구역*/}
        <div id={styles.lBox} className={styles.box}>
            <NavButton nav={"filter"} />
        </div>
        {/*툴바의 중앙 - logo */}
        <div id={styles.logoBox}>
            <NavButton nav={"logo"}/>
        </div>
        {/*툴바의 오른쪽 구역*/}
        <div id={styles.rBox} className={styles.box}>
        <NavButton nav={"post"}/>
        <NavButton nav={"library"}/>
        <NavButton nav={"more"}/>
        </div>
    </div>
    
    </>);
}

export default ToolBar;