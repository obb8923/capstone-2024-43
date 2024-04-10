import styles from '../css/NavButton.module.css'
import { Link } from "react-router-dom";
function NavButton(props){
    const nav = props.nav;
 return (<>
    <div>
    <Link className={styles.a} to={`/${nav}`}>{nav}</Link>
    </div>
 </>);   
}
export default NavButton;