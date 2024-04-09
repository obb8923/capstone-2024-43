import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Hello/>
    <Routes>
      <Route path="/" element={<KKK/>}/>
      <Route path="/KK/:kk" element={<KK/>}/>
      <Route path="*" element={<EmptyPage />}></Route>

    </Routes>
    <Footer/>
   </BrowserRouter>
  );
}

export default App;
