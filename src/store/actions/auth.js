import * as actionTypes from './actionTypes';
import axios from 'axios';
import fire from '../../fire';

export const getAuth = (token) => {
    localStorage.setItem('token', token);    
    return {
        type: actionTypes.GET_AUTH,
        token: token
    };
};

export const userLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.USER_LOGOUT
    };
};

export const setUserId = (userId) => {
    return {
        type: actionTypes.SET_USER_ID,
        userId: userId
    };
};

const addUserFirebase = (userId) => {
    fire.database().ref('users/' + userId).push({
        userName: userId
    });
};

const checkUserExists = (userId) => {
    const usersRef = fire.database().ref('/users');
    usersRef.child(userId).once('value', function(snapshot){
        if (!snapshot.exists()) {
            addUserFirebase(userId);
        } 
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
                const userId = response.data.id;
                localStorage.setItem('userId', userId);
                dispatch(setUserId(userId));
                checkUserExists(userId, token);
            })
            .catch((error) => {
                console.log(error);
            });
    };
};
