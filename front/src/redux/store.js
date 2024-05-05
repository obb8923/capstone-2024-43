import { createStore } from 'redux';
import isSignInReducer from './reducers';

const store = createStore(
    //리듀서들
    isSignInReducer,
    //개발자 도구를 사용하기 위한 설정
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
