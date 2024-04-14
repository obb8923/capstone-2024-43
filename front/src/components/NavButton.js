import React from 'react';
import styles from '../css/NavButton.module.css';
import { useNavigate } from 'react-router-dom';
import moreImg from '../imgs/more.svg';
import postImg from '../imgs/post.svg';
import libraryImg from '../imgs/library.svg'; 
import filterImg from '../imgs/filter.svg';
import logoImg from '../imgs/logo.svg';
function NavButton(props) {
   const nav = props.nav;
   const navigate = useNavigate();

   // 페이지 이동 함수
   function switchPage() {
      if (nav === "filter") {
         return;
      } else if (nav === "logo"){
         navigate(`/`);

      }
         else {
         navigate(`/${nav}`);
      }
   } 
   function selectImage(){
         if(nav==='filter') return filterImg;
         else if (nav==='more') return moreImg;
         else if (nav==='library') return libraryImg;
         else if (nav=== 'post') return postImg;
         else if (nav=== 'logo') return logoImg;

         }
   const image = selectImage()
   return (
      <span id={styles.buttonBody} onClick={switchPage}>
         <img id={styles.img}src={image} alt={nav}/>
         <span id={styles.buttonName}>{nav==='logo'?null:nav}</span>
      </span>
   );
}

export default NavButton;
