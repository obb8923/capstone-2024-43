import React, { useState } from "react";
import styles from "../css/SignIn.module.css";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


function SignIn(){
    const [user, setUser] = useState({});

    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const auth_google = () => signInWithPopup(auth, provider)
        .then( result => {
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            setUser(result.user);
        }).catch( err => {
            // const credential = GoogleAuthProvider.credentialFromError(err);
            // const errorCode = err.code;
            // const errorMessage = err.message;
            // const email = err.customData.email;
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