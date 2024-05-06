import React from "react";
import styles from "../css/MorePage.module.css"
function  MorePage(){// 더보기 페이지
//로그아웃, 정보수정, 공지사항, 문의하기, 
//쓴글
//임시저장글

    

 return(<>
    <div className={styles.box}>
        {/*기능 버튼들 */}
        <div className={styles.buttonBox}>
        <div></div><div></div><div></div><div></div>
        </div>
        {/* 쓴 글 */}
        <div className={styles.libraryBox}>
            <h2>내 서재</h2>
            <div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div>
        </div>
        {/* 임시저장 */}
        <div className={styles.libraryBox}>

        </div>
    </div>
 </>);
}

export default MorePage;