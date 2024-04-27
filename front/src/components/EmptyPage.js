import { Link } from "react-router-dom";

function EmptyPage(){
    return (<>
    <h1>없는 페이지 입니다.</h1>
    <Link to="/">메인으로 돌아가기</Link>
    </>);


} 
export default EmptyPage;