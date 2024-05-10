import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from './redux/store';

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAZxph79NBXXjaC4cThTYfAXvTkkG-6ZQY",
  authDomain: "moonhyang-book.firebaseapp.com",
  projectId: "moonhyang-book",
  storageBucket: "moonhyang-book.appspot.com",
  messagingSenderId: "752268884988",
  appId: "1:752268884988:web:b0f8b0b47eb689f3431079"
};

const firebaseApp = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
