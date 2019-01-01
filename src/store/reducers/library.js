import * as actionTypes from '../actions/actionTypes';

const initialState = {
    totalAlbums: [],
    offset: 0,
    playlists: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_TOTAL_ALBUMS:
            return {
                ...state,
                totalAlbums: [
                    ...state.totalAlbums,
                    ...action.totalAlbums.items
                ],
                offset: state.offset + 50
            };
        case actionTypes.DELETE_ALBUM_FROM_STORE:
            return {
                ...state,
                totalAlbums: state.totalAlbums.filter(
                    album => album.album.id !== action.albumSpotifyId
                )
            };
        case actionTypes.RESET_LIBRARY_STORE:
            return {
                ...state,
                totalAlbums: [],
                offset: 0
            };
        case actionTypes.SET_PLAYLISTS_IDS:
            return {
                ...state,
                playlists: action.playlists
            };
        default:
            return state;
    }
};

export default reducer;
