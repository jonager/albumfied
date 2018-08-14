import * as actionTypes from './actionTypes';

export const setPlayingStatus = (playing) => { 
    return {
        type: actionTypes.SET_PLAYING_STATUS,
        playing: playing
    };
};
