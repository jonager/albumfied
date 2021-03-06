import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import styles from './Playlist.css';
import Button from '../../../../components/UI/Button/Button';
import axios from 'axios';

class Playlist extends Component {
    state = {
        albums: [],
        playlistName: null
    };

    notifyRemoved = playlistName => {
        toast.error(`Album has been removed from ${playlistName}!`);
    };

    getAlbums = playlistId => {
        axios
            .get(`/api/playlists/${playlistId}`)
            .then(response => {
                this.setState({
                    albums: response.data.albums,
                    playlistName: response.data.name
                });
            })
            .catch(error => console.log(error));
    };

    deleteAlbumPlaylist = (playlistId, albumSpotifyId) => {
        axios
            .delete(`/api/playlists/${playlistId}/${albumSpotifyId}`)
            .then(response => {
                this.setState({
                    albums: response.data.albums
                });
            })
            .catch(error => console.log(error));
    };

    componentDidMount() {
        this.getAlbums(this.props.match.params.playlist_id);
    }

    render() {
        let albums = null;
        let message = null;

        if (this.state.albums.length !== 0) {
            albums = this.state.albums.map(album => {
                return (
                    <div key={album.albumSpotifyId} className={styles.Card}>
                        <img
                            style={{ width: '225px', height: '225px' }}
                            src={album.albumImgURI}
                            alt="Album/Artist"
                        />
                        <div className={styles.Info}>
                            <Link
                                to={'/artist/' + album.artistId}
                                title={album.artistName}>
                                {album.artistName}
                            </Link>
                            <Link
                                to={'/album/' + album.albumSpotifyId}
                                title={album.albumName}>
                                {album.albumName}
                            </Link>
                        </div>
                        <div>
                            <Button
                                btnType={'Delete'}
                                clicked={() => {
                                    this.deleteAlbumPlaylist(
                                        this.props.match.params.playlist_id,
                                        album.albumSpotifyId
                                    );
                                }}
                                clicked2={() => {
                                    this.notifyRemoved(this.state.playlistName);
                                }}>
                                Delete
                            </Button>
                        </div>
                    </div>
                );
            });
        } else {
            message = (
                <React.Fragment>
                    <p>Ooop! Your playlist seems to be empty.</p>
                    <p>
                        <Link to={'/search'}>
                            Search for your favorite albums and add them to{' '}
                            {this.props.match.params.playlistName}
                        </Link>
                    </p>
                </React.Fragment>
            );
        }

        return (
            <div className={styles.Playlist}>
                <div>
                    <h1>{this.state.playlistName}</h1>
                    <div className={styles.EmptyPlaylist}>{message}</div>
                </div>
                <div className={styles.Cards}>{albums}</div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userId: state.auth.userId
    };
};

export default withRouter(connect(mapStateToProps)(Playlist));
