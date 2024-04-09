import { Link } from "react-router-dom";

export default function EmptyPage(){
    return (<>
    <h1>없는 페이지 입니다.</h1>
    <button><Link to="/">메인으로 돌아가기</Link></button>

    </>);


} 