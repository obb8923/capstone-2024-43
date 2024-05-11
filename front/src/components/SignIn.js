import React, { useState } from "react";
import styles from "../css/SignIn.module.css";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
function SignIn(){
    console.log("signInd UID: ",localStorage.getItem('UID'));
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const auth_google = () => signInWithPopup(auth, provider)
        .then( result => {
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            setUser(result.user);
            fetch('/api/signIn',{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({userData:result.user})
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                localStorage.setItem('UID',result.user.uid);
                navigate('/');//홈으로 이동
            })
            .catch(error=>console.error('Error:', error));
        }).catch( error => {
            // const credential = GoogleAuthProvider.credentialFromError(err);
            // const errorCode = err.code;
            // const errorMessage = err.message;
            // const email = err.customData.email;
            console.log("error: ",error);
        });
        
    return (<>
    <div className={styles.signInBody}>
        <div className={styles.logo}></div>
        <button className={styles.button} onClick={auth_google}>구글로 로그인</button>
        <ul>
            { // Auth 테스트
            ["displayName", "email", "uid"].map( e => 
                <li>{e}: {JSON.stringify(user[e])}</li>
            )} 
        </ul>
    </div>
    </>);
}
export default SignIn;