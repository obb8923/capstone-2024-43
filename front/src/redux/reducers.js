
const initialState = {
    isSignIn:false,
    UID:''
};

function isSignInReducer(state = initialState, action) {
    console.log(state,action);
    switch (action.type) {
        case 'signIn':
            return { isSignIn:true, UID:action.UID };
        case 'signOut':
            return { isSignIn:false,UID:'' };
        default:
            return state;
    }
}

export default isSignInReducer;