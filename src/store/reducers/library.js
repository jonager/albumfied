import * as actionTypes from '../actions/actionTypes';

const initialState = {
    totalAlbums: null,
    playlists: null
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SET_TOTAL_ALBUMS: 
            return {
                ...state,
                totalAlbums: action.totalAlbums
            }
        case actionTypes.SET_PLAYLIST_NAME: 
            return {
                ...state,
                playlists: action.playlists
            }
        default:
            return state;
    }
};

export default reducer;