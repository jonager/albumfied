import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import styles from './ProgressBar.css';
import * as utility from '../../../shared/utility';

class ProgressBar extends Component {
    state = {
        progress: this.props.progress
    };
    currentTrackInterval = 0;
    progressRef = React.createRef();

    seekPosition = position_ms => {
        axios({
            method: 'PUT',
            url: `https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('spotifyToken')
            }
        });
    };

    onSetCurrentTrackInterval = () => {
        this.currentTrackInterval = setInterval(() => {
            this.setState((state, props) => ({
                progress: state.progress + 1000
            }));
        }, 1000);
    };

    getPosition = e => {
        e.persist();
        let newProgress = Math.ceil(
            ((e.clientX - this.progressRef.current.offsetLeft) /
                e.target.parentElement.clientWidth) *
                this.props.trackLength
        );
        this.seekPosition(newProgress);
        this.setState({
            progress: newProgress
        });
    };

    componentDidMount() {
        this.onSetCurrentTrackInterval();
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log(this.progressRef.current.style.width);
        // Reset progress when a new song starts playing
        if (this.props.trackLength !== prevProps.trackLength) {
            this.setState({
                progress: 0
            });
        }
        // Stop incrementing progress when player is paused
        if (this.props.playerState.paused) {
            clearInterval(this.currentTrackInterval);
        }
        // Runs interval after player has resumed
        if (!this.props.playerState.paused && prevProps.playerState.paused) {
            this.onSetCurrentTrackInterval();
            this.setState((state, props) => ({
                progress: state.progress + 500
            }));
        }
    }

    componentWillUnmount() {
        clearInterval(this.currentTrackInterval);
        if (this.props.player) {
            this.props.player.disconnect();
        }
    }

    render() {
        return (
            <div className={styles.ProgressBar}>
                <div className={styles.CurrentPosition}>
                    {this.state.progress >= this.props.trackLength
                        ? utility.millisToMinutesAndSeconds(
                              this.props.trackLength
                          )
                        : utility.millisToMinutesAndSeconds(
                              this.state.progress
                          )}
                </div>
                <div onClick={this.getPosition} className={styles.Bar}>
                    <div className={styles.BarBackground}>
                        <div
                            style={{
                                width:
                                    (this.state.progress /
                                        this.props.trackLength) *
                                        100 +
                                    '%'
                            }}
                            className={styles.BarForeground}
                            ref={this.progressRef}
                        />
                    </div>
                </div>
                <div className={styles.TrackLength}>
                    {utility.millisToMinutesAndSeconds(this.props.trackLength)}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        player: state.album.player,
        playerState: state.album.playerState
    };
};

export default connect(mapStateToProps)(ProgressBar);
