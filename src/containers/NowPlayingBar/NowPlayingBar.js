import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Button from '../../components/UI/Button/Button';
import styles from './NowPlayingBar.css';

class NowPlayingBar extends Component {
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

    render() {
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
        
        return (
            <div className={styles.NowPlayingBar}>
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
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.spotifyToken,
        isPlaying: state.album.isPlaying
    }
};

export default connect(mapStateToProps)(NowPlayingBar);