import ScrollView from "./ScrollView";
import styles from "../css/PostViewPage.module.css";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser'; // HTML 문자열을 React 구성 요소로 변환

function PostViewPage() {
  const {postId}=useParams();
  const[data,setData]=useState({});
  const [_li,set_Li]=useState([]);
  const [bookInfoContainerDisplay,setbookInfoContainerDisplay] = useState("none");
  const [buttonDisplay,setButtonDisplay] = useState("block");
  //postID로 글 찾아오기~
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });//화면 맨 위로 이동
    changeBlurBoxState();//blurBox state변경
    if (postId) { // postID가 존재하는 경우에만 fetch 요청 보냄
      fetch(`http://localhost:8080/api/post/${postId}`)
        .then(res => res.json())
        .then(json => {
          console.log("json[0]:", json[0]);
          setData(json[0]);
          return json[0];
        })
        .then((data)=>{
          console.log("data: ",data);
          const li_ = [];
          li_.push(<li>제목: {data.name}</li>);
          li_.push(<li>작가: {data.author}</li>);
          li_.push(<input type='hidden' name='q' value={data.name}></input>);
          set_Li(prev_Li=>[...prev_Li,...li_]);
        })
        .catch(error => console.log(error));
    }
  }, [postId]);

  function changeBlurBoxState(){
    setbookInfoContainerDisplay(bookInfoContainerDisplay==="flex"?"none":"flex");
    setButtonDisplay(buttonDisplay==="block"?"none":"block");
    document.documentElement.style.setProperty('--bookInfoContainer-display',bookInfoContainerDisplay);
    document.documentElement.style.setProperty('--button-display',buttonDisplay);
  }

  return (
    <>
      <article>
        <div className={styles.postBox}>
          {/* data가 로드되지 않았거나 body가 없는 경우를 고려하여 조건부 렌더링 */}
          {data && data.body && parse(data.body)}
          {!data && <p>Loading...</p>}
        </div>
      </article>

    <div className={styles.bookInfoBox}>
        <button className={styles.stateButton} onClick={changeBlurBoxState}>책 정보 확인하기</button>
        <div className={styles.bookInfoContainer}>
      <div className={styles.bookImg}>
        {/* <img src="" alt="bookImg"></img> */}
      </div>
      <div className={styles.bookInfo}>
      <form action="https://www.google.com/search" method="get" target="_blank">
        <ul className={styles.ul}>
          {_li}
          <li><button type="submit">책 정보 검색</button></li>
        </ul>
      </form>
      </div>
      </div>
    </div>
    <hr className={styles.line}></hr>
    <ScrollView/>
    </>
  );
}

export default PostViewPage;