import React from "react";
import styles from '../css/PostFragment.module.css';
function PostFragment(props){

    return (<>
    <div id={styles.fragmentBody} >
        {props.index}
    </div>
    </>);
}

export default PostFragment;