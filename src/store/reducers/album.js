import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isPlaying: false,
    currentTrack: null,
    deviceId: null,
    trackLength: null,
    player: null,
    playerState: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_PLAYING_STATUS:
            return {
                ...state,
                isPlaying: action.playing
            };
        case actionTypes.SET_CURRENT_TRACK_INFO:
            return {
                ...state,
                currentTrack: action.currentTrack,
                trackLength: action.currentTrack.current_track.duration_ms
            };
        case actionTypes.SET_DEVICE_ID:
            return {
                ...state,
                deviceId: action.deviceId
            };
        case actionTypes.SET_PLAYER:
            return {
                ...state,
                player: action.player
            };
        case actionTypes.SET_PLAYER_STATE:
            return {
                ...state,
                playerState: action.state
            };
        default:
            return state;
    }
};

export default reducer;
