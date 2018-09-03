import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';
import { Link } from 'react-router-dom';
import {ToastContainer, ToastStore} from 'react-toasts';
import axios from 'axios';
import styles from './Album.css';
import * as utility from '../../shared/utility';
import * as actions from '../../store/actions/index';
import * as Vibrant from 'node-vibrant';

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
        albumInfo: "",
        savedInLibrary: false,
        color: null
    };

    playerCheckInterval = null;

    getColor = (imgURL) => {
        Vibrant.from(imgURL)
            .getPalette()
            .then((palette) => {
                let availableColor = null;

                if (palette.DarkVibrant) {
                    availableColor = palette.DarkVibrant;
                } else if (palette.Muted) {
                    availableColor = palette.Muted;
                } else if (palette.LightMuted) {
                    availableColor = palette.LightMuted;
                } else {
                    availableColor = palette.LightVibrant;

                }

                this.setState({
                    color: availableColor._rgb.join()
                })
            })
    }

    notifyAddedRemoved = (action) => {
        action === 'success' 
        ? ToastStore.success('Album has been saved to Your Music!')
        : ToastStore.error('Album has been removed from Your Music!')
    }

    albumSaved() {
        this.setState ({
            savedInLibrary: true
        });
    }

    handleCheckForPlayer(index) {
        //checks that the player is available to use
        Album.playerCheckInterval = setTimeout(() => {
            this.checkForPlayer(index);
        }, 1000);
    }

    async checkForPlayer(index) {
        if (window.Spotify !== null) {
            clearTimeout(Album.playerCheckInterval);
            this.player = new window.Spotify.Player({
                name: `${this.props.userId}'s Spotify Player`,
                getOAuthToken: cb => { cb(this.props.token); },
            });
            // finally, connect!
            await this.player.connect();
            await this.createEventHandlers(index);
        }
    }

    onStateChanged(state) {
        // if we're no longer listening to music, we'll get a null state.
        if (state !== null) {;
            this.props.onSetPlayStatus(!state.paused);
            this.props.onSetCurrentTrackInfo(state.track_window)
        }
    }

    createEventHandlers(index) {
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
            this.player.on('player_state_changed', () => this.onStateChanged(state));
        });

        // Ready
        this.player.on('ready', async data => {
            let { device_id: deviceId } = data;
            await this.props.onSetDeviceId(deviceId);
            await this.transferPlaybackHere(deviceId);
            await this.playAlbum(deviceId, this.props.match.params.id, index);
        });
    }

    //make music play on the app regardless of whether the user was playing music somewhere else or not
    transferPlaybackHere(deviceId) {
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
            method: 'GET',
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
                this.getColor(response.data.images[0].url);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    playAlbum = (deviceId, albumId, offset = 0) => {
        axios({
            method: 'PUT',
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
                context_uri: `spotify:album:${albumId}`,
                offset: {"position": offset}
            }
        });
    };

    checkAlbumSavedInLibrary = (albumId) => {
        axios({
            method: 'GET',
            url: `https://api.spotify.com/v1/me/albums/contains`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            },
            params: {
                ids: albumId,
            }
        })
        .then((response => {
            this.setState({
                savedInLibrary: response.data[0]
            });
        }));
    };

    deleteAlbumSpotify = (token, albumId) => {
        axios({
            method: 'delete',
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
        .then(() => {
            this.props.onResetLibraryStore();
            this.setState({
                savedInLibrary: false
            });
        })
    };

    componentDidMount() {
        const albumId = this.props.match.params.id;
        this.checkAlbumSavedInLibrary(albumId)
        this.getAlbum(albumId, this.props.token);
    }

    render() {
        let currentAlbum =
            this.state.albumInfo
                ? <div className={styles.AlbumInfo}>
                    <img style={{ width: '325px', height: '325px' }}
                        src={this.state.albumInfo.images[0].url}
                        alt="Album-cover" />
                    <h2>{this.state.albumInfo.name}</h2>
                    <Link to={'/artist/' + this.state.albumInfo.artists[0].id}>
                        <span>{this.state.albumInfo.artists[0].name}</span>
                    </Link> 
                    <span>{`${this.state.albumInfo.release_date.slice(0, 4)} • ${this.state.albumInfo.tracks.items.length} SONGS`}</span>
                    <Button 
                        btnType={'PlayPause'}
                        clicked={() => {
                            this.props.isPlaying 
                            ? this.playAlbum(this.props.deviceId, this.props.match.params.id) 
                            : this.handleCheckForPlayer()
                        }}
                        >Play</Button>
                    {this.state.savedInLibrary 
                        ? <p 
                            onClick={() => { 
                                this.deleteAlbumSpotify(this.props.token, this.props.match.params.id); 
                                this.notifyAddedRemoved('remove');}} 
                                className={styles.Remove}
                                >remove from your library</p> 
                        : <p 
                            onClick={() => {
                                utility.saveAlbumSpotify(this.props.token, this.props.match.params.id); 
                                this.albumSaved();
                                this.props.onResetLibraryStore();
                                this.notifyAddedRemoved('success');}} 
                                className={styles.Save}
                                >save to your library</p>}
                </div>
                : null;

        let tracks = null;

        if (this.state.albumInfo) {
            let currentTrackId = null;
            if(this.props.currentTrack) {
                currentTrackId = this.props.currentTrack.current_track.id;
            }
            let tracksArr = this.state.albumInfo.tracks.items;

            tracks = tracksArr.map((track, index) => {
                return (
                    <li className={styles.AlbumTracks} key={track.id}>
                        <span onClick={() => {
                            this.props.isPlaying
                            ? this.playAlbum(this.props.deviceId, this.props.match.params.id, index)
                            : this.handleCheckForPlayer(index)}}
                            style={currentTrackId === track.id ? {color: '#1ed760'} : null}>{track.name}</span>
                        <span>{utility.millisToMinutesAndSeconds(track.duration_ms)}</span>
                    </li>
                );
            });
        }

        return (
            <div className={styles.Album}
                style={this.state.color 
                    ? {backgroundImage: `linear-gradient(rgba(${this.state.color}, 0.75), rgba(7, 5, 10, 0.75) 85%)`}
                    :null}>
                <React.Fragment>
                    {currentAlbum}
                </React.Fragment>
                <div>
                    <ul>
                        {tracks}
                    </ul>
                </div>
                <ToastContainer store={ToastStore} position={ToastContainer.POSITION.TOP_RIGHT}/>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        token: state.auth.spotifyToken,
        userId: state.auth.userId,
        loggedIn: state.auth.isAuth,
        currentTrack: state.album.currentTrack,
        isPlaying: state.album.isPlaying,
        deviceId: state.album.deviceId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetPlayStatus: (playing) => dispatch(actions.setPlayingStatus(playing)),
        onSetCurrentTrackInfo: (currentTrack) => dispatch(actions.setCurrentTrackInfo(currentTrack)),
        onResetLibraryStore: () => dispatch(actions.resetLibraryStore()),
        onSetDeviceId: (deviceId) => dispatch(actions.setDeviceId(deviceId))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Album));