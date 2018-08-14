import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isPlaying: false
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SET_PLAYING_STATUS: 
            return {
                ...state,
                isPlaying: action.playing
            }
        default:
            return state;
    }
};

export default reducer;