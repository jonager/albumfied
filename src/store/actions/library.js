import * as actionTypes from './actionTypes';
import axios from 'axios';
import fire from '../../fire';

export const setPlaylistName = (libraryName) => {    
    return {
        type: actionTypes.SET_PLAYLIST_NAME,
        libraryName: libraryName
    };
};