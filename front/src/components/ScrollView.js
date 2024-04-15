import React, { useEffect, useState } from 'react';
import PostFragment from './PostFragment';

function ScrollView() {
  const count = 10; // 한 번에 추가되는 item의 개수
  let index =0;
  //const [index, setIndex] = useState(0); // item의 index를 상태로 관리
  const [fragments, setFragments] = useState([]); // PostFragment 컴포넌트들을 담을 상태

  useEffect(() => {
    const options = {
      root:null,
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
            console.log("entry.isIntersecting")
          const newFragments = [];
          for (let i = index; i < index + count; i++) {
            newFragments.push(<PostFragment key={i} index={i} />);
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

  return (
    <span>
      <div className="list">
        {fragments} {/* fragments 배열을 렌더링 */}
      </div>
      <p className="list-end">list-end</p>
    </span>
  );
}

export default ScrollView;
