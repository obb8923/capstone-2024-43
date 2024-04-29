import React from "react";
import styles from "../css/SignIn.module.css"
function SignIn(){
    function auth_google(){
        // google 로그인 기능
    }
    return (<>
    <div className={styles.signInBody}>
        <div className={styles.logo}></div>
        <button className={styles.button} onClick={auth_google}>구글로 로그인</button>
    </div>
    </>);
}
export default SignIn;