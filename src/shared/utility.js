import * as env from '../env';

export const spotifyAuth = () => {
    let scope = "user-library-read user-library-modify user-read-email streaming";
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${env.CLIENT_ID}&response_type=token&redirect_uri=http://localhost:3001/callback&scope=${scope}`
};

export const parseParam = (hash, param) => {
    let urlParams = new URLSearchParams(hash);
    let  value = urlParams.get(param);

    return value;
};