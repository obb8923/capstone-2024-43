import React from 'react';
import Main from './components/Main';
import SignIn from './components/SignIn';
import ToolBar from './components/ToolBar';
import MorePage from './components/MorePage';
import PostPage from './components/PostPage';
import EmptyPage from './components/EmptyPage';
import PostViewPage from './components/PostViewPage';
import AnnouncementPage from './components/AnnouncementPage';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation(); // 여기서 useLocation을 사용합니다.
  
  return (
    <>
      {location.pathname !== '/signIn' && <ToolBar />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/post/edit/:postId" element={<PostPage />} />
        <Route path="/more" element={<MorePage />} />
        <Route path="/post/:postId" element={<PostViewPage />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/announcement" element={<AnnouncementPage/>} />
        <Route path="*" element={<EmptyPage />} />
      </Routes>
    </>
  );
}

export default App;
