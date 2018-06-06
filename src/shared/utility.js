import * as env from '../env';
import axios from 'axios';

export const spotifyAuth = () => {
    let scope = "user-library-read user-library-modify user-read-email streaming";
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${env.CLIENT_ID}&response_type=token&redirect_uri=http://localhost:3001/callback/&scope=${scope}`
};

export const parseParam = (hash, param) => {
    let urlParams = new URLSearchParams(hash);
    let  value = urlParams.get(param);

    return value;
};

export const getAlbums = (token) => {
    console.log(token)
    axios({
        method:'get',
        url:'https://api.spotify.com/v1/me/albums',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }})
        .then( (response) => {
            console.log(response.data.items);
        })
        .catch((error) => {
            console.log(error);
        });
};

export const searchItem = (token, searchQuery) => {
    console.log(searchQuery)
    axios({
        method:'get',
        url:'https://api.spotify.com/v1/search',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        params: {
            q: `${searchQuery}`,
            type: 'album,artist',
            market: 'US'
        }})
        .then( (response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
};