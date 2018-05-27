import * as env from '../env';

export const spotifyAuth = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${env.CLIENT_ID}&response_type=token&redirect_uri=http://localhost:3002/callback/`
};

export const parseParam = (param) => {
    let hash = window.location.hash.substr(1);
    let urlParams = new URLSearchParams(hash);
    let  value = urlParams.get(param);

    return value;
};