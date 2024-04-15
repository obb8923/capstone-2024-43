import React,{useState,useEffect} from 'react';
import styles from '../css/NavButton.module.css';
import { useNavigate,useLocation } from 'react-router-dom';
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
   const location = useLocation();
   useEffect(() => {
      console.log(location);
    }, [ location ])
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
   const image = selectImage()

   //여기서 부터 모달 관리
   let subtitle;
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
         
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>modal 내용을 꾸미세요~</h2>
          <button onClick={closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>
      </div>
      </>
   );
}

export default NavButton;
