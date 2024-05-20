import React from "react";
import styles from '../css/PostFragment.module.css';
import { useNavigate,useLocation } from "react-router-dom";
import parse from 'html-react-parser';

function PostFragment(props){
    const {pathname} = useLocation();
    const navigate = useNavigate();
    return (<>
    <article onClick={() =>{
        if(pathname!=='/announcement')
        navigate(`/post/${props.postId}`)
        }}>
    <div className={styles.fragmentBody}>
        {parse(props.post)}
    </div>
    </article>
    </>);
}

export default PostFragment;