import axios from 'axios';

export const parseParam = (hash, param) => {
    let urlParams = new URLSearchParams(hash);
    let value = urlParams.get(param);

    return value;
};

export const millisToMinutesAndSeconds = millis => {
    let min = 0 | (millis / 1000 / 60);
    let sec = 0 | (millis / 1000) % 60;

    return min + ':' + (sec < 10 ? '0' : '') + sec;
};

export const getIdFromURI = str => {
    return str.split(':')[2];
};

export const saveAlbumSpotify = (token, albumId) => {
    axios({
        method: 'put',
        url: `https://api.spotify.com/v1/me/albums`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        params: {
            ids: albumId
        }
    });
};
