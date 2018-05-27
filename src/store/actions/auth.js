import * as actionTypes from './actionTypes';

export const getAuth = (token) => {
    return {
        type: actionTypes.GET_AUTH,
        token: token
    }
}