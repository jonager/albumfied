import * as actionTypes from './actionTypes';

export const setTotalAlbums = totalAlbums => {
    return {
        type: actionTypes.SET_TOTAL_ALBUMS,
        totalAlbums: totalAlbums
    };
};

export const deleteAlbumFromStore = albumSpotifyId => {
    return {
        type: actionTypes.DELETE_ALBUM_FROM_STORE,
        albumSpotifyId: albumSpotifyId
    };
};

export const resetLibraryStore = () => {
    return {
        type: actionTypes.RESET_LIBRARY_STORE
    };
};

export const setPlaylistsIds = playlists => {
    return {
        type: actionTypes.SET_PLAYLISTS_IDS,
        playlists: playlists
    };
};
