import Main from './components/Main';
import EmptyPage from './components/EmptyPage';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main/>}/>
      <Route path="*" element={<EmptyPage />}></Route>
    </Routes>
   </BrowserRouter>
  );
}

export default App;
