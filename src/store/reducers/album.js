import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isPlaying: false,
    currentTrack: null,
    deviceId: null
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SET_PLAYING_STATUS: 
            return {
                ...state,
                isPlaying: action.playing
            }
        case actionTypes.SET_CURRENT_TRACK_INFO: 
            return {
                ...state,
                currentTrack: action.currentTrack
            }
        case actionTypes.SET_DEVICE_ID: 
            return {
                ...state,
                deviceId: action.deviceId
            }
        default:
            return state;
    }
};

export default reducer;