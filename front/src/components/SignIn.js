import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { signIn } from "../redux/actions";
import styles from "../css/SignIn.module.css"
function SignIn(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    function auth_google(){
        // google 로그인 기능
    }
    const [isSignInFailed,setIsSignInFailed]=useState(true);
    const [signInState,setSignInState]=useState({
        id:'',
        password:''
    });

    function onChangeHandler(event){//id,password입력될때마다 state 변경
        const {name,value}=event.target;
        setSignInState(prevState=>({...prevState,[name]:value}));
    }

    function handleSubmit(event){
        event.preventDefault();//페이지 리로드 방지
        fetch('/api/signIn',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(signInState)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if(data.isUserExist){//로그인 성공
                dispatch(signIn());//signIn 상태 변경
                navigate('/');//홈으로 이동
            }else{//로그인 실패
                setIsSignInFailed(true);
                document.documentElement.style.setProperty('--error-display',isSignInFailed);
            }
          })
        .catch(error=>console.error('Error:', error));
    }
    return (<>
    <div className={styles.signInBody}>
        <div className={styles.logo}></div>
        <form className={styles.form} name="signIn" onSubmit={handleSubmit}>
            <input type="text" placeholder="아이디" name="id" required="true" onChange={onChangeHandler}></input>
            <input type="password" placeholder="비밀번호" name="password" required="true" onChange={onChangeHandler}></input>
            <input type="submit" value="로그인하기"></input>
        </form>
        <div className={styles.error}>이메일 또는 비밀번호가 잘못되었습니다.</div>
        <button className={styles.button} onClick={auth_google}>구글로 로그인</button>
    </div>
    </>);
}
export default SignIn;