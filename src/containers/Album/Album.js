import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';
import styles from './Album.css';
import * as utility from '../../shared/utility';

class Album extends Component {
    state = {
        deviceId: "",
        error: "",
        trackName: "",
        artistName: "",
        albumName: "",
        playing: false,
        position: 0,
        duration: 0,
        albumInfo: ""
    };

    static playerCheckInterval = null;

    handleCheckForPlayer() {
        clearTimeout(Album.playerCheckInterval);
        Album.playerCheckInterval = setTimeout(() => {
            this.checkForPlayer();
        }, 1000);
    }

    onPrevClick() {
        this.player.previousTrack();
    }

    onPlayClick() {
        this.player.togglePlay();
    }

    onNextClick() {
        this.player.nextTrack();
    }

    checkForPlayer() {
        console.log(this.state.playing)
        if (this.state.playing) {
            this.player.pause();
        }
        if (window.Spotify !== null) {
            this.player = new window.Spotify.Player({
                name: `${this.props.userId}'s Spotify Player`,
                getOAuthToken: cb => { cb(this.props.token); },
            });
            this.createEventHandlers();

            // finally, connect!
            this.player.connect();
        }
    }

    onStateChanged(state) {
        // if we're no longer listening to music, we'll get a null state.
        if (state !== null) {
            let {
                current_track: currentTrack,
                position,
                duration,
            } = state.track_window;
            const trackName = currentTrack.name;
            const albumName = currentTrack.album.name;
            const artistName = currentTrack.artists
                .map(artist => artist.name)
                .join(", ");
            const playing = !state.paused;

            this.setState({
                position,
                duration,
                trackName,
                albumName,
                artistName,
                playing
            });
        }
    }

    createEventHandlers() {
        // console.log(this)
        this.player.on('initialization_error', e => { console.error(e); });
        this.player.on('authentication_error', e => {
            console.error(e);
            //dispatch auth.logout
        });
        this.player.on('account_error', e => { console.error(e); });
        this.player.on('playback_error', e => { console.error(e); });

        // Playback status updates
        this.player.on('player_state_changed', state => {
            console.log(state)
            this.player.on('player_state_changed', state => this.onStateChanged(state));
        });

        // Ready
        this.player.on('ready', async data => {
            let { device_id: deviceId } = data;
            await this.setState({ deviceId: deviceId });
            // this.transferPlaybackHere();
            this.playAlbum(this.state.deviceId, this.props.match.params.id)
        });
    }

    //make music play on the app regardless of whether the user was playing music somewhere else
    transferPlaybackHere() {
        const { deviceId } = this.state;
        fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
                authorization: `Bearer ${this.props.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "device_ids": [deviceId],
                "play": true,
            }),
        });
    }

    getAlbum = (albumID, token) => {
        axios({
            method: 'get',
            url: `https://api.spotify.com/v1/albums/${albumID}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            params: {
                market: 'US'
            }
        })
            .then((response) => {
                this.setState({
                    albumInfo: response.data
                })
            })
            .catch((error) => {
                console.log(error);
            });
    };

    playAlbum = (deviceId, albumId) => {
        axios({
            method: 'put',
            url: `https://api.spotify.com/v1/me/player/play`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            },
            params: {
                device_id: deviceId,
            },
            data: {
                context_uri: `spotify:album:${albumId}`
            }
        });
    };

    componentDidMount() {
        // this.handleCheckForPlayer()
        this.getAlbum(this.props.match.params.id, this.props.token)
    }

    render() {
        let {
            artistName,
            trackName,
            albumName,
            error,
            position,
            duration,
            playing,
        } = this.state;

        let currentAlbum =
            this.state.albumInfo
                ? <div className={styles.AlbumInfo}>
                    <img style={{ width: '325px', height: '325px' }}
                        src={this.state.albumInfo.images[0].url}
                        alt="Album-cover" />
                    <h2>{this.state.albumInfo.name}</h2>
                    <span>{this.state.albumInfo.artists[0].name}</span>
                    <span>{`${this.state.albumInfo.release_date.slice(0, 4)} • ${this.state.albumInfo.tracks.items.length} SONGS`}</span>
                    <Button btnType={'PlayPause'}>Play</Button>
                </div>
                : null;

        let tracks = null;
        if (this.state.albumInfo) {
            let tracksArr = this.state.albumInfo.tracks.items
            console.log(tracksArr)
            tracks = tracksArr.map(track => {
                return (
                    <li className={styles.AlbumTracks} key={track.id}>
                        <span>{track.name}</span>
                        <span>{utility.millisToMinutesAndSeconds(track.duration_ms)}</span>
                    </li>
                );
            });
        }

        return (
            <div className={styles.Album}>
                <React.Fragment>
                    {currentAlbum}
                </React.Fragment>
                <div>
                    <ol>
                        {tracks}
                    </ol>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        token: state.auth.spotifyToken,
        userId: state.auth.userId,
        loggedIn: state.auth.isAuth
    }
};

export default withRouter(connect(mapStateToProps)(Album));