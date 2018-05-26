import * as env from '../env';

export const spotifyAuth = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${env.CLIENT_ID}&response_type=token&redirect_uri=http://localhost:3001/callback/`
};

export const parseToken = () => {
    let hash = window.location.hash.substr(1);
    let urlParams = new URLSearchParams(hash);
    let token = urlParams.get('access_token');

    return token;
};