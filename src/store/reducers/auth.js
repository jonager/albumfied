import * as actionTypes from '../actions/actionTypes';

const initialState = {
    spotifyId: null,
    error: null,
    loading: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_AUTH:
            return {
                ...state,
                spotifyId: action.spotifyId
            };
        case actionTypes.USER_LOGOUT:
            return {
                ...state,
                spotifyToken: null,
                userId: null,
                isAuth: false
            };
        default:
            return state;
    }
};

export default reducer;
