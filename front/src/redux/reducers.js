const initialState = {
    isSignIn:false,
    count: 0
};

function isSignInReducer(state = initialState, action) {
    switch (action.type) {
        case 'signIn':
            return { isSignIn:true };
        case 'signOut':
            return { isSignIn:false };
        default:
            return state;
    }
}

export default isSignInReducer;
