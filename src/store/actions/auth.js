import * as actionTypes from './actionTypes';
import axios from 'axios';
import fire from '../../fire';


export const getAuth = (token) => {
    return {
        type: actionTypes.GET_AUTH,
        token: token
    }
}

export const setUserId = (userId) => {
    return {
        type: actionTypes.SET_USER_ID,
        userId: userId
    }
}

const addUserFirebase = (userId) => {
    console.log(userId);
    fire.database().ref('users/' + userId).push({
        userName: userId
    });
};

export const getUserId = (token) => {
    return dispatch => {
        axios({
            method:'get',
            url:'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + token
            }})
            .then( (response) => {
                dispatch(setUserId(response.data.id));
                addUserFirebase(response.data.id);
            })
            .catch((error) => {
                console.log(error);
            })
    }
}
