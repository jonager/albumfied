import * as actionTypes from '../actions/actionTypes';

const initialState = {
    playlists: []
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SET_PLAYLIST_NAME: 
            return {
                ...state,
                playlists: [
                    ...state.playlists,
                    action.libraryName
                ]
            }
        default:
            return state;
    }
};

export default reducer;