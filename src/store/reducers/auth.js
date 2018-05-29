import * as actionTypes from '../actions/actionTypes';

const initialState = {
    spotifyToken: null,
    userId: null,
    error: null,
    isAuth: false,
    loading: false,
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.GET_AUTH: 
            return {
                ...state,
                spotifyToken: action.token,
                isAuth: true
            }
        case actionTypes.SET_USER_ID:
            console.log(action.userId);
            return {
                ...state,
                userId: action.userId
            }
        default:
            return state;
    }
};

export default reducer;