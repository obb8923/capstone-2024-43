import styles from '../css/NavButton.module.css'
import { useNavigate } from 'react-router-dom';

function NavButton(props) {
   const nav = props.nav;
   const navigate = useNavigate();

   function switchPage() {
      if(nav==="filter") ;
      else navigate(`/${nav}`);
   } 

   return (<><div id="buttonBody">
      <div id="button" className={styles.button} onClick={switchPage}>
        image
      </div>
      <div id="buttonName">{nav}</div>
      </div>
      </>
   );   
}
export default NavButton;