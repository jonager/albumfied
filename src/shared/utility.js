import * as env from '../env';
import axios from 'axios';

export const spotifyAuth = () => {
    let scope = "user-library-read user-library-modify user-read-email streaming user-read-birthdate user-read-private";
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${env.CLIENT_ID}&response_type=token&redirect_uri=http://localhost:3000/callback/&scope=${scope}`
};

export const parseParam = (hash, param) => {
    let urlParams = new URLSearchParams(hash);
    let  value = urlParams.get(param);

    return value;
};

export const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

export const saveAlbumSpotify = (token, albumId) => {
    axios({
        method: 'put',
        url: `https://api.spotify.com/v1/me/albums`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            'Authorization': 'Bearer ' + token
        },
        params: {
            ids: albumId
        }
    })
};