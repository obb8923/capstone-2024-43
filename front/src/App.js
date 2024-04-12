import Main from './components/Main';
import ToolBar from './components/ToolBar';
import EmptyPage from './components/EmptyPage';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <ToolBar/>
    <Routes>
      <Route path="/" element={<EmptyPage/>}/>
      <Route path="*" element={<EmptyPage />}></Route>
    </Routes>
   </BrowserRouter>
  );
}

export default App;
