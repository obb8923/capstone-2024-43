import React from 'react';
import { useLocation, useParams } from 'react-router-dom'; // URL 파라미터 사용

function PostViewPage() {
  const { postId } = useParams(); 
  const { state } = useLocation(); 

  
  const { title, content } = state || {};

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <p>ID: {postId}</p>
    </div>
  );
}

export default PostViewPage;

