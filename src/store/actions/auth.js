import * as actionTypes from './actionTypes';

export const getAuth = (spotifyId, spotifyToken) => {
    return {
        type: actionTypes.GET_AUTH,
        spotifyId: spotifyId
    };
};

export const userLogout = () => {
    localStorage.removeItem('spotifyToken');
    localStorage.removeItem('spotifyId');
    return {
        type: actionTypes.USER_LOGOUT
    };
};
