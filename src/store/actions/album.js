import * as actionTypes from './actionTypes';

export const setPlayingStatus = (playing) => { 
    return {
        type: actionTypes.SET_PLAYING_STATUS,
        playing: playing
    };
};

export const setCurrentTrackInfo = (currentTrack) => { 
    return {
        type: actionTypes.SET_CURRENT_TRACK_INFO,
        currentTrack: currentTrack
    };
};

export const setDeviceId = (deviceId) => { 
    return {
        type: actionTypes.SET_DEVICE_ID,
        deviceId: deviceId
    };
};
