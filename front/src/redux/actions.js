export const signIn = (UID) => {
    return {
        type: 'signIn',
        UID:UID
    };
};

export const signOut = () => {
    return {
        type: 'signOut'
    };
};
