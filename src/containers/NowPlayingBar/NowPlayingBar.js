import React, { Component } from 'react';
import Button from '../../components/UI/Button/Button';
import Slider from '../../components/UI/Slider/Slider';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import styles from './NowPlayingBar.css';
import * as utility from '../../shared/utility';

class NowPlayingBar extends Component {
    state = {
        volume: 100,
        unmutedVolume: null
    }

    inputVolumeRef = React.createRef();

    sliderHandler = (event) => {
        this.setVolume(event.target.value);
    }

    playAlbum = () => {
        axios({
            method: 'PUT',
            url: `https://api.spotify.com/v1/me/player/play`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            }
        });
    };

    pauseAlbum = () => {
        axios({
            method: 'PUT',
            url: `https://api.spotify.com/v1/me/player/pause`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            }
        });
    };

    playNextSong = () => {
        axios({
            method: 'POST',
            url: `https://api.spotify.com/v1/me/player/next`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            }
        });
    };

    playPreviousSong = () => {
        axios({
            method: 'POST',
            url: `https://api.spotify.com/v1/me/player/previous`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            }
        });
    };

    setVolume = (volume = 100) => {
        axios({
            method: 'PUT',
            url: `https://api.spotify.com/v1/me/player/volume`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            },
            params: {
                volume_percent: volume,
                device_id: this.props.deviceId
            }
        }).then(
            this.setState({
                volume: volume
            }));
    };

    muteVolume = (volume) => {
        if (this.state.unmutedVolume === null) {
            this.inputVolumeRef.current.value = 0;
            this.setVolume(0);
            this.setState({
                unmutedVolume: volume,
                volume: 0
            });
        } else {
            this.inputVolumeRef.current.value = this.state.unmutedVolume;
            this.setVolume(this.state.unmutedVolume);
            this.setState({
                volume: this.state.unmutedVolume,
                unmutedVolume: null
            });
        }
    }

    render() {
        let albumCover, songName, artistName, artistId, albumId = null;
        
        let resumePauseAlbum = <Button
            btnType={'PlayingBar'}
            clicked={this.playAlbum}
            ><i className="far fa-play-circle"></i></Button>;
        
        if (this.props.isPlaying) {
            resumePauseAlbum = <Button
                btnType={'PlayingBar'}
                clicked={this.pauseAlbum}
                ><i className="far fa-pause-circle"></i></Button>
        }

        if (this.props.currentTrack) {
            let albumInfo = this.props.currentTrack.current_track.album;
            let currentTrack = this.props.currentTrack.current_track;

            let imgURL = albumInfo.images[0].url;
            songName = currentTrack.name;
            artistName = currentTrack.artists[0].name;

            artistId = utility.getIdFromURI(currentTrack.artists[0].uri);
            albumId = utility.getIdFromURI(albumInfo.uri);

            albumCover = <img style={{width:'85px', height: '85px'}} 
                        src={imgURL} 
                        alt="Album"/> 
        }

        return (
            <div className={styles.NowPlayingBar}>
                <div className={styles.TrackInfo}>
                <Link to={'/album/' + albumId} title={songName}>{albumCover}</Link> 
                    <div>
                        <span>
                            <Link to={'/album/' + albumId} title={songName}>{songName}</Link> 
                        </span>
                        <span>
                            <Link to={'/artist/' + artistId} title={artistName}>{artistName}</Link> 
                        </span>
                    </div>
                </div>

                <div className={styles.PlayingButtons}>
                    <Button
                        btnType={'PlayingBar'}
                        clicked={this.playPreviousSong}
                        ><i className="fas fa-backward"></i></Button>
                    {resumePauseAlbum}
                    <Button
                        btnType={'PlayingBar'}
                        clicked={this.playNextSong}
                        ><i className="fas fa-forward"></i></Button>
                </div>
                {this.props.currentTrack 
                    ? <Slider 
                        muteVolume={this.muteVolume} 
                        volume={+this.state.volume} 
                        sliderHandler={this.sliderHandler}
                        inputVolumeRef={this.inputVolumeRef}
                        ></Slider>
                    : null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.spotifyToken,
        isPlaying: state.album.isPlaying,
        currentTrack: state.album.currentTrack,
        deviceId: state.album.deviceId
    }
};

export default connect(mapStateToProps)(NowPlayingBar);