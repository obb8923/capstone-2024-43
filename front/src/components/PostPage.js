import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEditor from './TextEditor';
import '../css/PostPage.css';
/*
editor 라이브러리를 위해 수정함. 
다음과 같이 설치해야 정상적으로 작동함.
npm install @ckeditor/ckeditor5-build-classic
npm install @ckeditor/ckeditor5-react
npm add file:./ckeditor5
*/

function PostPage() {
  const navigate = useNavigate();

  const [editorData, setEditorData] = useState('');
  const [title, setTitle] = useState('');
  const [bookSearch, setBookSearch] = useState('');


  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handlePost = () => {
    // 제목, 내용, 책 정보가 모두 입력되었는지 확인.
    if (
      title.trim() !== '' &&
      editorData.trim() !== ''
    ) {
      // 확인 후 포스팅.
      if (window.confirm('포스팅 하시겠습니까?')) {

        // 현재 날짜와 시간을 가져옴
        const currentDate = new Date();

        // 연도, 월, 일, 시간, 분, 초를 추출
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        // 연도, 월, 일, 시간, 분, 초를 조합하여 postId 생성
        const postId = `${year}${month}${day}${hours}${minutes}${seconds}`;
        alert('포스팅 되었습니다.');
        //postId 시간을 받아서 ->... 
        // 나갔다가 다시 들어오면 내용 없음.

        //저장 구현 시작.

        const htmlContent = editorData;

        const postData = { postId, title, htmlContent};

        fetch('/api/savepost', {
          method: 'POST',
          //POST 메서드를 사용했는데, 이는 서버에 데이터를 전송하기 위한 것.
          headers: {
            'Content-Type': 'application/json', 
            //Content-Type 헤더를 설정하여 전송할 데이터의 타입을 명시. application/json은 전송할 데이터가 JSON 형식임을 나타냄.
          },
          body: JSON.stringify(postData),
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message);
            navigate(`/post/${postId}`);
          })
          .catch(error => {
            console.error('데이터를 게시하는 중 오류:', error);
            alert('포스트를 저장하는 중 오류가 발생했습니다.');
          });
        }
    } else {
      // 입력이 누락된 경우 알림. 모두 입력해야 함.
      alert('제목과 내용, 책 정보를 모두 입력해주세요.');
    }
  };

  const handleSaveDraft = () => {
    // 임시 저장 로직 추가
    console.log('Draft Saved');
  };

  const handleBookSearchChange = (event) => {
    setBookSearch(event.target.value);
  };

  return (
    <div className="post-page-container">
      <div className="title-button-container">
        <input
          type="text"
          placeholder="제목을 입력하세요..."
          value={title}
          onChange={handleTitleChange}
          className="title-input"
        />
        <input
          type="text"
          placeholder="책 검색..."
          value={bookSearch}
          onChange={handleBookSearchChange}
          className="book-search-input"
        />
        <div className="button-container">
          <button className="post-button" onClick={handleSaveDraft}>임시 저장</button>
          <button className="post-button" onClick={handlePost}>포스팅</button>
        </div>
      </div>
      <div className="ck-editor__editable">
         <TextEditor setData={setEditorData}/>
      </div>
    </div>
  );
}

export default PostPage;