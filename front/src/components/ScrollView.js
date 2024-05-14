import React, { useEffect, useState } from 'react';
import PostFragment from './PostFragment';
import styles from "../css/ScrollView.module.css";
import { useParams,useLocation } from 'react-router-dom';
function ScrollView() {//무한스크롤
  const {pathname}=useLocation();
  console.log("scrollView pathname: ",pathname);
  const {postId} = useParams();
  const UID = localStorage.getItem('UID');
  const reqObject = {
    pathname : pathname,
    postID:postId,
    UID : UID
  };
  const [listEndVisibility,setListEndVisibility] = useState("visible");
  const count = 15;
  let index =0;
  const [fragments, setFragments] = useState([]); // PostFragment 컴포넌트들을 담을 상태

  useEffect(() => {
    const options = {
      root:null,
      //document.querySelector(`.${styles.mainBox}`),
      threshold: 0.1 
    };  
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("entry.isIntersecting");
          fetch("http://localhost:8080/api/ScrollView",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqObject)
          })
          .then(res=>res.json())
          .then(json=>{
            console.log(json);
              const newFragments = [];
              for (let i = index; i < index+count; i++) {
                //console.log("i:",i,"json: " ,json);
                if(json[i]==undefined){
                  setListEndVisibility("hidden");
                  console.log("lack");
                  break;
                }
                newFragments.push(<PostFragment key={i} postId={json[i].postID==undefined?json[i].id:json[i].postID} post={json[i].body}/>);
              }
              setFragments(prevFragments => [...prevFragments, ...newFragments]); // 기존 fragments에 새로운 fragments를 추가
              index+=count;
            }
          )
          .catch((error)=>{console.log("erorr: "+error)})
        }
      });
    }
    const observer = new IntersectionObserver(callback,options);
    
    // listEnd 요소를 관찰
    const target = document.querySelector(`.${styles.listEnd}`);
    if (target) {
      observer.observe(target);
    }
    // IntersectionObserver 객체를 cleanup하기 위해 return에서 disconnect 호출
    return () => observer.disconnect();
  }, []);
  //
  useEffect(() => {
    document.documentElement.style.setProperty('--listEndVisibility', listEndVisibility);
  }, [listEndVisibility]);
  return (
    <div className={styles.mainBox}>
      <div className="list">
        {fragments} {/* fragments 배열을 렌더링 */}
      </div>
      <div className={styles.listEnd}></div>
    </div>
  );
}

export default ScrollView;
