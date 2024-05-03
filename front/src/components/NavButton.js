import React,{useState,useEffect} from 'react';
import styles from '../css/NavButton.module.css';
import { useNavigate } from 'react-router-dom';
import moreImg from '../imgs/more.svg';
import postImg from '../imgs/post.svg';
import libraryImg from '../imgs/library.svg'; 
import filterImg from '../imgs/filter.svg';
import logoImg from '../imgs/logo.svg';
import Modal from 'react-modal';// 설치 필요 'npm install react-modal'

const customStyles = {//modal css 임시적용
   content: {
     top: '50%',
     left: '50%',
     right: 'auto',
     bottom: 'auto',
     marginRight: '-50%',
     transform: 'translate(-50%, -50%)',
   },
 };

function NavButton(props) {
   const nav = props.nav; //{filter , post , library , more , logo}
   const navigate = useNavigate();
   
   // 페이지 이동 함수
   function switchPage() {
      if (nav === "filter") {
         return;
      } else if (nav === "logo"){
         navigate(`/`);
      } else {
         navigate(`/${nav}`);
      }
   } 

   function selectImage(){//nav 에 따라 이미지 변경 require로 동적 처리 하려했는데 실패해서 정적처리한 후 일일히 지정
      if(nav==='filter') return filterImg;
      else if (nav==='more') return moreImg;
      else if (nav==='library') return libraryImg;
      else if (nav=== 'post') return postImg;
      else if (nav=== 'logo') return logoImg;
   }
   const image = selectImage();

   //여기서 부터 모달 관리
   let subtitle="modal";
   const [isOpen, setIsOpen] = useState(false);

   useEffect(() => {
     const appElement = document.getElementById('modalContainer');
     Modal.setAppElement(appElement);
  }, []);
   
   function openModal() {
      if(nav==='filter'){
         console.log("open modal ")
         setIsOpen(true);
      }
     
   }
     function afterOpenModal() {
       //modal 이 열리고 난 이후 적용시킬 것을 적으면 된다~
       //subtitle.style.color = '#f00';
   }
     function closeModal() {
       setIsOpen(false);
   }
    // 체크박스 상태
   const [checkboxStates, setCheckboxStates] = useState({
      literature: false,
      history: false,
      science: false,
      art: false,
      language: false,
      philosophy: false
   });
 // 체크박스 상태 변경 핸들러
 const handleCheckboxChange = (event) => {
   const { name, checked } = event.target;
   setCheckboxStates(prevState => ({
     ...prevState,
     [name]: checked
   }));
 };
   // 폼 제출 핸들러
   const handleSubmit = (event) => {
      event.preventDefault(); // 페이지 리로드 방지
      fetch('/api/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkboxStates)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        closeModal();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    };
   return (
      <>
      <span id={styles.buttonBody} onClick={()=>{switchPage();openModal();}}>
         <img id={styles.img}src={image} alt={nav}/>
         <span id={styles.buttonName}>{nav==='logo'?null:nav}</span>
      </span>
      
      <div id="modalContainer">
        <Modal
          isOpen={isOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <button onClick={closeModal}>close</button>
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>{subtitle}</h2>
          <form name="filter" onSubmit={handleSubmit}>
          {/* 총류 / 철학,심리학,윤리학 / 종교 / 사회과학 / 자연과학 / 기술과학 / 예술 / 언어 / 역사 / 문학 */}
            <label><input name="literature" type="checkbox" checked={checkboxStates.literature} onChange={handleCheckboxChange} />문학</label>
            <label><input name="history" type="checkbox" checked={checkboxStates.history} onChange={handleCheckboxChange} />역사, 사회과학</label>
            <label><input name="science" type="checkbox" checked={checkboxStates.science} onChange={handleCheckboxChange} />기술, 자연과학</label>
            <label><input name="art" type="checkbox" checked={checkboxStates.art} onChange={handleCheckboxChange} />예술</label>
            <label><input name="language" type="checkbox" checked={checkboxStates.language} onChange={handleCheckboxChange} />언어</label>
            <label><input name="philosophy" type="checkbox" checked={checkboxStates.philosophy} onChange={handleCheckboxChange} />철학,심리,윤리</label>
            <input type="submit" value="확인"/>

          </form>
        </Modal>
      </div>
      </>
   );
}

export default NavButton;