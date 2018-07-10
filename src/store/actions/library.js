import * as actionTypes from './actionTypes';

export const setTotalAlbums = (totalAlbums) => {    
    return {
        type: actionTypes.SET_TOTAL_ALBUMS,
        totalAlbums: totalAlbums
    };
};

export const setPlaylistName = (playlists) => {    
    return {
        type: actionTypes.SET_PLAYLIST_NAME,
        playlists: playlists
    };
};