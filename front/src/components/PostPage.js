import React, { useState } from 'react';
import { EditorState } from 'draft-js'; //설치해야 함
import { Editor } from 'react-draft-wysiwyg'; //설치해야 함
import { useNavigate } from 'react-router-dom'; // 추가
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../css/PostPage.css'; // CSS 파일을 import

function PostPage() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSaveDraft = () => {
    // 임시저장 기능 구현되지 않음.
    console.log("임시 저장");
  };

  const handlePost = () => {
    // 포스팅 기능 구현
    if (title.trim() !== '' && editorState.getCurrentContent().hasText()) {
      if (window.confirm('포스팅 하시겠습니까?')) {
        // 확인 버튼을 누르면 포스팅
        alert('포스팅 되었습니다.');
        // 여기에서 포스팅된 글의 ID를 생성하고 해당 ID로 PostViewPage로 이동. 그러나 작성한 글의 내용은 저장되지 않음.
        const postId = Math.floor(Math.random() * 1000); // 임시로 ID 생성
        navigate(`/post/${postId}`, { 
          state: {
            title,
            content: editorState.getCurrentContent().getPlainText(),
            postId
          }
        });
      }
    } else {
      alert('제목과 내용을 모두 입력해주세요.');
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
          className="title-input" // CSS 클래스 추가
        />
        <div className="button-container">
          <button className="save-draft-button" onClick={handleSaveDraft}>임시 저장</button>
          <button className="post-button" onClick={handlePost}>포스팅</button>
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

export default PostPage;
