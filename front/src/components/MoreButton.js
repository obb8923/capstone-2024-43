import React from "react";
import styles from "../css/MoreButton.module.css";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/actions";
import { useNavigate } from "react-router-dom";

function MoreButton({nav}){
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    const handleClick =()=>{
        switch(nav){
            case 'modifyInfo':
                break;
            case 'announcement':
                break;
            case 'contactUs':
                break;
            case 'signOut':
                signOutSequence();
                break;
            default:
                break;
        }
    }
    const signOutSequence=()=>{
        dispatch(signOut());
        navigate('/signIn');
    }
    return (<>
    <div className={styles.MoreButton} onClick={handleClick}>
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.3999 19.2058L2.72011 17.794C4.61414 19.7116 7.24477 20.4587 10.1529 20.4587C15.9226 20.4587 20.5999 15.7815 20.5999 10.0118C20.5999 7.15025 19.4494 4.55744 17.5858 2.67066L18.9056 1.54126M16.3468 9.69412C16.3468 13.4464 13.305 16.4882 9.55276 16.4882C5.80051 16.4882 2.75871 13.4464 2.75871 9.69412C2.75871 5.94187 5.80051 2.90007 9.55276 2.90007C13.305 2.90007 16.3468 5.94187 16.3468 9.69412Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    </>);
}

export default MoreButton;