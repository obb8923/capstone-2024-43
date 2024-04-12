import Main from './components/Main';
import ToolBar from './components/ToolBar';
import EmptyPage from './components/EmptyPage';
import WritePage from './components/WritePage';

import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <ToolBar/>
    <Routes>
      <Route path="/" element={<Main/>}/>
      <Route path="*" element={<EmptyPage />}></Route>
      <Route path="/writepage" element={<WritePage />} />
    </Routes>
   </BrowserRouter>
  );
}

export default App;
