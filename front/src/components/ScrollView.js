import React, { useEffect, useState } from 'react';
import PostFragment from './PostFragment';
import axios from 'axios';


function ScrollView() {
    //
    const [data, setData] = useState([]);

    // 여기서부터 무한 스크롤 설정
  const count = 20; // 한 번에 추가되는 item의 개수
  let index =0;
  //const [index, setIndex] = useState(0); // item의 index를 상태로 관리
  const [fragments, setFragments] = useState([]); // PostFragment 컴포넌트들을 담을 상태

  useEffect(() => {
    const options = {
      root:null,
      threshold: 0.1
    };
    const fetch = async () => {
      try{
        const res = await axios.get("http://localhost:8080/api/ScrollView");
        console.log(res.data);
        setData(res.data);
      }catch(err){
        console.log(err)
      }
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async(entry) => {
        if (entry.isIntersecting) {
          console.log("entry.isIntersecting");
          try{
            const res = await axios.get("http://localhost:8080/api/ScrollView");
            console.log(res.data);
            setData(res.data);
          }catch(err){
            console.log(err)
          }
          const newFragments = [];
          for (let i = index; i < index + count; i++) {
            newFragments.push(<PostFragment key={i} postID={i} post={data[i+1]}/>);//postID만 가지고 검색할 예정
          }
          setFragments(prevFragments => [...prevFragments, ...newFragments]); // 기존 fragments에 새로운 fragments를 추가
          index+=count;
          //setIndex(prevIndex => prevIndex + count); // index 상태 갱신
        }
      });
    }, options);
    
    // list-end 요소를 관찰
    const target = document.querySelector('.list-end');
    if (target) {
      observer.observe(target);
    }

    // IntersectionObserver 객체를 cleanup하기 위해 return에서 disconnect 호출
    return () => observer.disconnect();
  }, []);
  //
  return (
    <span>
        {/* <div className="datas">
        {data.map(d => (
            <>
          <div className="postid" key={d.id}>{d.postID}</div>
          <div className="post" key={d.id}>{d.body}</div>
          <div className="uid" key={d.id}>{d.UID}</div>
          <div className="status" key={d.id}>{d.status}</div>
          <div className="create_at" key={d.id}>{d.create_at}</div>
          <div className="isbn" key={d.id}>{d.isbn}</div>
          <div className="postscol" key={d.id}>{d.postscol}</div>
          </>
        ))}
      </div> */}
      <div className="list">
        {fragments} {/* fragments 배열을 렌더링 */}
      </div>
      <p className="list-end">list-end</p>
    </span>
  );
}

export default ScrollView;
