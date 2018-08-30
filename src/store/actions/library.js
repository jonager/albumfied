import * as actionTypes from './actionTypes';

export const setTotalAlbums = (totalAlbums) => {  
    return {
        type: actionTypes.SET_TOTAL_ALBUMS,
        totalAlbums: totalAlbums
    };
};

export const deleteAlbumFromStore = (addedTime) => {    
    return {
        type: actionTypes.DELETE_ALBUM_FROM_STORE,
        addedTime: addedTime
    };
};

export const resetLibraryStore = () => {    
    return {
        type: actionTypes.RESET_LIBRARY_STORE
    };
};

export const setPlaylistName = (playlists) => {    
    return {
        type: actionTypes.SET_PLAYLIST_NAME,
        playlists: playlists
    };
};