import Main from './components/Main';
import ToolBar from './components/ToolBar';
import MorePage from './components/MorePage';
import EmptyPage from './components/EmptyPage';
import PostPage from './components/PostPage';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <ToolBar/>
    <Routes>
      <Route path="/" element={<Main/>}/>
      <Route path="/post" element={<PostPage/>}/>
      <Route path="/more" element={<MorePage/>}/>
      <Route path="*" element={<EmptyPage />}/>
    </Routes>
   </BrowserRouter>
  );
}

export default App;
