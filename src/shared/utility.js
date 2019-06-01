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

export const getCoverStyling = playlist => {
    let coverStyling = { width: '225px', height: '225px' };
    let firstFourAlbums = playlist.albums.slice(-4);

    if (firstFourAlbums.length === 0) {
        return coverStyling;
    } else if (firstFourAlbums.length < 4) {
        coverStyling = {
            ...coverStyling,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(${
                // always grabs the first album added
                firstFourAlbums[firstFourAlbums.length - 1].albumImgURI
            })`,
            backgroundPosition: `center center`
        };
    } else {
        coverStyling = {
            ...coverStyling,
            backgroundSize: '50%',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(${firstFourAlbums[0].albumImgURI}),
                url(${firstFourAlbums[1].albumImgURI}),
                url(${firstFourAlbums[2].albumImgURI}),
                url(${firstFourAlbums[3].albumImgURI})`,
            backgroundPosition: `0% 0%, 100% 0%, 100% 100%, 0% 100%`
        };
    }
    return coverStyling;
};
