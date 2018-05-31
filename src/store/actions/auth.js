import * as actionTypes from './actionTypes';
import axios from 'axios';
import fire from '../../fire';

export const getAuth = (token) => {
    return {
        type: actionTypes.GET_AUTH,
        token: token
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

const checkUserExists = (userId, token) => {
    const usersRef = fire.database().ref('/users');
    usersRef.child(userId).once('value', function(snapshot){
        if (!snapshot.exists()) {
            addUserFirebase(userId);
        } 
    });
};

// export const getAlbums = (token) => {
//     console.log(token)
//     axios({
//         method:'get',
//         url:'https://api.spotify.com/v1/me/albums',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + token
//         }})
//         .then( (response) => {
//             console.log(response.data.items);
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// };

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
                dispatch(setUserId(userId));
                checkUserExists(userId, token);
            })
            .catch((error) => {
                console.log(error);
            });
    };
};
