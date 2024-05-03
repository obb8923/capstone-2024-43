import ScrollView from "./ScrollView";
import styles from "../css/PostViewPage.module.css";
import React from 'react';
import { useEffect,useState } from 'react';
import { useLocation,Link } from 'react-router-dom';
import parse from 'html-react-parser'; // HTML 문자열을 React 구성 요소로 변환

function PostViewPage() {
  
  const location = useLocation();
  const {postID} = location.state; 
  const[data,setData]=useState({});
  //postID로 글 찾아오기~
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: 'auto' });//화면 맨 위로 이동
    fetch(`http://localhost:8080/api/post/${postID}`)
    .then(res=>res.json())
    .then(json=>{
      console.log(json[0]);
      setData(json[0]);
    })
    .catch(error=>console.log(error))
  },[postID])
  //const { title, editorData } = location.state; // PostPage에서 전달된 데이터 가져오기
  function offBlur(){
    document.documentElement.style.setProperty('--blurBox-display','none');
    document.documentElement.style.setProperty('--button-display','none');
  }
  return (
    <>
    <article>
    <div className={styles.postBox}>
      {data.body}
      {/* data.body 에 html 정보가 저장될 예정, 정보를 변환시켜야함 */}
    </div>
    </article>

    <div className={styles.bookInfoBox}>
      <div className={styles.blurBox}>
        <button onClick={offBlur}>책 정보 확인하기</button>
      </div>
      <div className={styles.bookImg}>
        <img src="" alt="bookImg"></img>
      </div>
      <div className={styles.bookInfo}>
        <ul>
          <li>제목</li>
          <li>작가</li>
          <li>설명</li>
          <li><Link>서점으로 이동</Link></li>
        </ul>
      </div>
    </div>
    <hr className={styles.line}></hr>
    <ScrollView/>
    </>
  );
}

export default PostViewPage;