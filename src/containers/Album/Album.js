import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import styles from './Album.css';
import * as utility from '../../shared/utility';
import * as actions from '../../store/actions/index';
import * as getPixels from 'get-pixels';
import * as palette from 'get-rgba-palette';

class Album extends Component {
    state = {
        error: null,
        position: 0,
        duration: 0,
        albumInfo: null,
        albumLength: null,
        savedInLibrary: false,
        color: null
    };

    playerCheckInterval = null;
    player = null;

    getColor = imgURL => {
        getPixels(imgURL, (err, pixels) => {
            let color = palette(pixels.data, 1);

            this.setState({
                color: color.join()
            });
        });
    };

    notifyAddedRemoved = action => {
        action === 'success'
            ? toast.success('Album has been saved to Your Music!')
            : toast.error('Album has been removed from Your Music!');
    };

    async checkForPlayer(index) {
        if (window.Spotify !== null) {
            let token = localStorage.getItem('spotifyToken');
            // clearTimeout(Album.playerCheckInterval);
            this.player = new window.Spotify.Player({
                name: `${localStorage.getItem('spotifyId')}'s Spotify Player`,
                getOAuthToken: cb => {
                    cb(token);
                }
            });
            // finally, connect!
            await this.player.connect();
            await this.createEventHandlers(index);
        }
    }

    onStateChanged(state) {
        // if we're no longer listening to music, we'll get a null state.
        if (state !== null) {
            this.props.onSetPlayStatus(!state.paused);
            this.props.onSetCurrentTrackInfo(state.track_window);
        }
    }

    createEventHandlers(index) {
        this.player.on('initialization_error', e => {
            console.error(e);
        });
        this.player.on('authentication_error', e => {
            console.error(e);
            //dispatch auth.logout
        });
        this.player.on('account_error', e => {
            console.error(e);
        });
        this.player.on('playback_error', e => {
            console.error(e);
        });

        // Playback status updates
        this.player.on('player_state_changed', state => {
            this.props.onSetPlayerState(state);
            this.onStateChanged(state);
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
        fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                authorization: `Bearer ${localStorage.getItem('spotifyToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                device_ids: [deviceId],
                play: true
            })
        });
    }

    getAlbumSpotify = albumId => {
        axios
            .get(`/api/spotify/album/${albumId}`)
            .then(response => {
                this.getColor(response.data.images[0].url);
                this.getAlbumLength(response.data.tracks.items);
                this.setState({
                    albumInfo: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    getAlbumLength = albumTracks => {
        let albumLength = null;

        albumTracks.forEach(
            albumTrack => (albumLength += albumTrack.duration_ms)
        );

        this.setState({
            albumLength: utility.millisToMinutesAndSeconds(albumLength)
        });
    };

    playAlbum = (deviceId, albumId, offset = 0) => {
        axios({
            method: 'PUT',
            url: `https://api.spotify.com/v1/me/player/play`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('spotifyToken')
            },
            params: {
                device_id: deviceId
            },
            data: {
                context_uri: `spotify:album:${albumId}`,
                offset: { position: offset }
            }
        }).then(response => {
            this.props.onSetPlayer(this.player);
        });
    };

    checkAlbumSavedInLibrary = albumId => {
        axios
            .get(`/api/spotify/albums/contains/${albumId}`)
            .then(response => {
                this.setState({
                    savedInLibrary: response.data[0]
                });
            })
            .catch(error => console.log(error));
    };

    saveAlbumSpotify = albumId => {
        axios
            .put(`/api/spotify/albums/save/${albumId}`)
            .then(response => {
                this.notifyAddedRemoved('success');
                this.props.onResetLibraryStore();
                this.setState({
                    savedInLibrary: true
                });
            })
            .catch(response => console.log(response));
    };

    deleteAlbumSpotify = album_id => {
        axios
            .delete(`/api/spotify/albums/${album_id}`)
            .then(response => {
                this.notifyAddedRemoved('remove');
                this.props.onResetLibraryStore();
                this.setState({
                    savedInLibrary: false
                });
            })
            .catch(error => console.log(error));
    };

    componentDidMount() {
        const albumId = this.props.match.params.id;
        this.checkAlbumSavedInLibrary(albumId);
        this.getAlbumSpotify(albumId);
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.getAlbumSpotify(this.props.match.params.id);
        }
    }

    render() {
        let tracks = null;

        let currentAlbum = this.state.albumInfo ? (
            <div className={styles.AlbumInfo}>
                <img
                    style={{ width: '325px', height: '325px' }}
                    src={this.state.albumInfo.images[0].url}
                    alt="Album-cover"
                />
                <h2>{this.state.albumInfo.name}</h2>
                <Link to={'/artist/' + this.state.albumInfo.artists[0].id}>
                    <span>{this.state.albumInfo.artists[0].name}</span>
                </Link>
                <span>{`${this.state.albumInfo.release_date.slice(0, 4)} • ${
                    this.state.albumInfo.tracks.items.length
                } SONGS`}</span>
                <p>{`Length ${this.state.albumLength}`}</p>
                <Button
                    btnType={'PlayPause'}
                    clicked={() => {
                        this.props.isPlaying
                            ? this.playAlbum(
                                  this.props.deviceId,
                                  this.props.match.params.id
                              )
                            : this.checkForPlayer();
                    }}>
                    Play
                </Button>
                {this.state.savedInLibrary ? (
                    <p
                        onClick={() => {
                            this.deleteAlbumSpotify(this.props.match.params.id);
                        }}
                        className={styles.Remove}>
                        remove from your library
                    </p>
                ) : (
                    <p
                        onClick={() => {
                            this.saveAlbumSpotify(this.props.match.params.id);
                        }}
                        className={styles.Save}>
                        save to your library
                    </p>
                )}
            </div>
        ) : null;

        if (this.state.albumInfo) {
            let currentTrackId = null;
            if (this.props.currentTrack) {
                currentTrackId = this.props.currentTrack.current_track.id;
            }
            let tracksArr = this.state.albumInfo.tracks.items;

            tracks = tracksArr.map((track, index) => {
                return (
                    <li
                        onClick={() => {
                            this.props.isPlaying
                                ? this.playAlbum(
                                      this.props.deviceId,
                                      this.props.match.params.id,
                                      index
                                  )
                                : this.checkForPlayer(index);
                        }}
                        className={styles.AlbumTracks}
                        style={
                            currentTrackId === track.id
                                ? { color: '#1ed760' }
                                : null
                        }
                        key={track.id}>
                        <div>
                            <span
                                style={{
                                    marginRight: '.8em',
                                    fontSize: '.75em'
                                }}>
                                {currentTrackId === track.id ? (
                                    <i className="fas fa-headphones" />
                                ) : (
                                    <i className="fas fa-music" />
                                )}
                            </span>
                            <span>{track.name}</span>
                        </div>
                        <span>
                            {utility.millisToMinutesAndSeconds(
                                track.duration_ms
                            )}
                        </span>
                    </li>
                );
            });
        }

        return (
            <div
                className={styles.Album}
                style={
                    this.state.color
                        ? {
                              backgroundImage: `linear-gradient(rgba(${
                                  this.state.color
                              }, 0.75), rgba(7, 5, 10, 0.75) 85%)`
                          }
                        : null
                }>
                <React.Fragment>{currentAlbum}</React.Fragment>
                <div>
                    <ul>{tracks}</ul>
                </div>
                <Helmet>
                    <title>
                        {this.props.currentTrack
                            ? this.props.currentTrack.current_track.name
                            : 'Albumfied'}
                    </title>
                </Helmet>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetPlayStatus: playing => dispatch(actions.setPlayingStatus(playing)),
        onSetCurrentTrackInfo: currentTrack =>
            dispatch(actions.setCurrentTrackInfo(currentTrack)),
        onResetLibraryStore: () => dispatch(actions.resetLibraryStore()),
        onSetDeviceId: deviceId => dispatch(actions.setDeviceId(deviceId)),
        onSetPlayer: player => dispatch(actions.setPlayer(player)),
        onSetPlayerState: state => dispatch(actions.setPlayerState(state))
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Album)
);
