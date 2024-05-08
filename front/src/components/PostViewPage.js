import ScrollView from "./ScrollView";
import styles from "../css/PostViewPage.module.css";
import React from 'react';
import { useEffect,useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import parse from 'html-react-parser'; // HTML 문자열을 React 구성 요소로 변환

function PostViewPage() {
  const {postId}=useParams();
  const [blurBoxDisplay,setBlurBoxDisplay] = useState("flex");
  const [buttonDisplay,setButtonDisplay] = useState("block");
  const[data,setData]=useState({});
  //postID로 글 찾아오기~
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: 'auto' });//화면 맨 위로 이동
    changeBlurBoxState();//blurBox state변경
    if (postId) { // postID가 존재하는 경우에만 fetch 요청 보냄
      fetch(`http://localhost:8080/api/post/${postId}`)
        .then(res => res.json())
        .then(json => {
          console.log("data:",json[0]);
          setData(json[0]);
        })
        .catch(error => console.log(error));
    }
  }, [postId]);
  

  function changeBlurBoxState(){
    setBlurBoxDisplay(blurBoxDisplay==="flex"?"none":"flex");
    setButtonDisplay(buttonDisplay==="block"?"none":"block");
    document.documentElement.style.setProperty('--blurBox-display',blurBoxDisplay);
    document.documentElement.style.setProperty('--button-display',buttonDisplay);
  }
  
  return (
    <>
    <article>
    <div className={styles.postBox}>
      {console.log(data.body)}
      {parse(data.body)}
      {/* data.body 에 html 정보가 저장될 예정, 정보를 변환시켜야함 */}
    </div>
    </article>

    <div className={styles.bookInfoBox}>
      <div className={styles.blurBox}>
        <button onClick={changeBlurBoxState}>책 정보 확인하기</button>
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