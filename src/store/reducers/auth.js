import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isAuth: false,
    spotifyToken: null,
    userId: null,
    error: null,
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
            return {
                ...state,
                userId: action.userId
            }
        case actionTypes.USER_LOGOUT:
            return {
                ...state,
                spotifyToken: null,
                userId: null,
                isAuth: false
            }
        default:
            return state;
    }
};

export default reducer;