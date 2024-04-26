import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import classicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';
//import FontSize from 'ckeditor/ckeditor5-font'//npm install --save @ckeditor/ckeditor5-font
import '../css/PostPage.css';

function PostPage() {
  const navigate = useNavigate();

  //editorData는 CKEditor의 데이터 모델에 따라 형식이 지정된 텍스트임. 
  //HTML 형식이 아니라 CKEditor의 내부 형식에 따라 구조화되어 있음.

  const [editorData, setEditorData] = useState('');
  const [title, setTitle] = useState('');

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    //editor.getData() 메서드가 호출되어 사용자가 편집한 내용을 가져옴. 
    //CKEditor의 내부 데이터 모델에 따라 구조화된 텍스트이며, 일반적으로 HTML 형식으로 변환됨.
    setEditorData(data);
  };

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

        // CKEditor의 editorData를 HTML로 변환
        const htmlContent = editorData;
    
        navigate(`/post/${postId}`, {
          state: {
            title, 
            editorData: htmlContent  // HTML 형식의 문자열로 변환된 editorData 전달
          },
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
        <div className="button-container">
          <button className="post-button" onClick={handleSaveDraft}>임시 저장</button>
          <button className="post-button" onClick={handlePost}>포스팅</button>
        </div>
      </div>
      <div className="editor-container">
        <CKEditor
          editor={classicEditor}
          data={editorData}
          onChange={handleEditorChange}
          config={{
            toolbar: [
              'heading', '|', 'bold', 'italic', 'link', '|',
              'fontSize', 'bulletedList', 'numberedList', '|', 'undo', 'redo' 
            ]
          }}
        />
      </div>
    </div>
  );
}

export default PostPage;


/*import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js'; // 설치해야 함. npm install draft-js
import { Editor } from 'react-draft-wysiwyg'; // 설치해야 함. npm install react-draft-wysiwyg
import { useNavigate } from 'react-router-dom'; // 설치되어 있어야 함.
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../css/PostPage.css'
import draftToHtml from 'draftjs-to-html'

function PostPage() {
  // useState 훅을 이용하여 초기값을 설정.
  const [editorState, setEditorState] = useState(EditorState.createEmpty()); 
  const [title, setTitle] = useState(''); 
  const [bookTitle, setBookTitle] = useState(''); 
  const [author, setAuthor] = useState(''); 
  const [publisher, setPublisher] = useState(''); 

  //useNavigate를 사용하여 경로 이동. <Link>나 <NavLink>와 같은 컴포넌트를 클릭하여 라우팅하는 것과 동일한 효과.
  const navigate = useNavigate(); 

  // 내용이 변경될 때 호출되는 함수들.
  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  
  const handleBookTitleChange = (e) => {
    setBookTitle(e.target.value);
  };

 
  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
  };

  
  const handlePublisherChange = (e) => {
    setPublisher(e.target.value);
  };

  // 임시 저장 버튼 클릭 시 호출되는 함수.
  const handleSaveDraft = () => {
    console.log("임시 저장");
    // 아직 구현하지 않음. 저장 기능이 구현되어야 구현하는 것이 의미가 있을 것 같아 아직 안함.
  };

  // 포스팅 버튼 클릭 시 호출되는 함수.
  const handlePost = () => {
    // 제목, 내용, 책 정보가 모두 입력되었는지 확인.
    if (
      title.trim() !== '' &&
      editorState.getCurrentContent().hasText() &&
      bookTitle.trim() !== '' &&
      author.trim() !== '' &&
      publisher.trim() !== ''
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
    
        navigate(`/post/${postId}`, {
          state: {
            title,
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())), 
            // convertToRaw 함수를 사용시 contentState 객체를 JavaScript 객체로 변환할 수 있음.
            postId,
            bookTitle,
            author,
            publisher,
          },
        });
      }
    } else {
      // 입력이 누락된 경우 알림. 모두 입력해야 함.
      alert('제목과 내용, 책 정보를 모두 입력해주세요.');
    }
  };

  return (
    <div className="post-page-container">
      <div className="title-button-container">
        <input
          type="text"
          placeholder="제목을 입력해주세요.."
          value={title}
          onChange={handleTitleChange}
          className="title-input"
        />
        {/*일단 사용자가 책 정보를 입력하게 함. 나중에 수정할 예정.*//*}
        <div className="book-info">
          <input
            type="text"
            placeholder="책 제목"
            value={bookTitle}
            onChange={handleBookTitleChange}
          />
          <input
            type="text"
            placeholder="저자"
            value={author}
            onChange={handleAuthorChange}
          />
          <input
            type="text"
            placeholder="출판사"
            value={publisher}
            onChange={handlePublisherChange}
          />
        </div>
        <div className="button-container">
          <button className="post-button" onClick={handleSaveDraft}>
            임시 저장
          </button>
          <button className="post-button" onClick={handlePost}>
            포스팅
          </button>
        </div>
      </div>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        toolbar={{
          options: ['inline', 'list', 'textAlign'],
          inline: {
            options: ['bold'],
          },
        }}
      />
    </div>
  );
}

export default PostPage;*/