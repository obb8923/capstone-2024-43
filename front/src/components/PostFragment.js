import React from "react";
import styles from '../css/PostFragment.module.css';
import { useNavigate } from "react-router-dom";
function PostFragment(props){
    const navigate = useNavigate();
    return (<>
    <article onClick={() =>{navigate(`/post/${props.postId}`,{state:{postId:props.postId}})}}>
    <div className={styles.fragmentBody}>
        {props.post}
    </div>
    </article>
    </>);
}

export default PostFragment;