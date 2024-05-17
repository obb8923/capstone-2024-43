import React, { useEffect, useState } from 'react';
import PostFragment from './PostFragment';
import styles from "../css/ScrollView.module.css";
import { useParams, useLocation } from 'react-router-dom';

function ScrollView() {
  const {pathname} = useLocation();
  console.log("scrollView pathname: ", pathname);
  const {postId} = useParams();
  const UID = localStorage.getItem('UID');
  const [isFirst, setIsFirst] = useState(true); // isFirst 상태 관리 추가
  const [listEndVisibility, setListEndVisibility] = useState("visible");
  const count = 10;
  let index = 0;
  const [fragments, setFragments] = useState([]);
  useEffect(() => {
    if(pathname==='/announcement')setListEndVisibility("none");
    fetch("/api/ScrollView", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({isFirst:isFirst})
          })
    const options = {
      root: null,
      threshold: 0.1 
    };  
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("entry.isIntersecting");
          const reqObject = {
            pathname: pathname,
            postID: postId,
            UID: UID,
          };
          fetch("http://localhost:8080/api/ScrollView", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqObject)
          })
          .then(res => res.json())
          .then(json => {
            
            setIsFirst(false); // 첫 로딩 후 isFirst를 false로 설정
            console.log(json)
            const newFragments = [];
            const jsonLength=json.length;
            console.log("jsonL: ",jsonLength)
            for (let i = index; i <  jsonLength; i++) {
              if(jsonLength===0 || json[i]==null || json[i]==undefined){
              //if (json[i] === undefined) {
                setListEndVisibility("hidden");
                console.log("lack");
                break;
              }
              newFragments.push(<PostFragment key={i} postId={json[i].postID === undefined ? json[i].id : json[i].postID} post={json[i].body} />);
            }
            setFragments(prevFragments => [...prevFragments, ...newFragments]);
            index += jsonLength;
          })
          .catch((error) => {
            console.log("error: " + error)
          })
        }
      });
    }
    const observer = new IntersectionObserver(callback, options);
    
    const target = document.querySelector(`.${styles.listEnd}`);
    if (target) {
      observer.observe(target);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--listEndVisibility', listEndVisibility);
  }, [listEndVisibility]);

  return (
    <div className={styles.mainBox}>
      <div className="list">
        {fragments}
      </div>
      <div className={styles.listEnd}></div>
    </div>
  );
}

export default ScrollView;
