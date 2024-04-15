import React, { useEffect } from 'react';

function ScrollView() {
  const count = 20; // 한 번에 추가되는 item의 개수
  let index = 0; // item의 index

  useEffect(() => {
    const options = {
      root: null,
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const list = document.querySelector('.list');
          for (let i = index; i < index + count; i++) {
            const item = document.createElement('p');
            item.textContent = i;
            item.className = 'item';
            list.appendChild(item);
          }
          index += count;
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
  }, 
  []);//useEffect 끝!

  return (
    <>
      <div className="list"></div>
      <p className="list-end"></p>
    </>
  );
}

export default ScrollView;
