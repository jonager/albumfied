import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Playlists.css';
import * as actions from '../../../store/actions/index';
import { Link } from 'react-router-dom';
import Button from '../../../components/UI/Button/Button';
import Modal from '../../../components/UI/Modal/Modal';
import axios from 'axios';

class Playlists extends Component {
    // TODO: add cover to playlist
    state = {
        playlistId: null,
        playlistName: null,
        showDelete: false
    };

    toggleModalDelete = (playlistId, playlistName) => {
        if (playlistId) {
            this.setState({
                playlistId: playlistId,
                playlistName: playlistName,
                showDelete: !this.state.showDelete
            });
        } else {
            this.setState({
                playlistId: null,
                playlistName: null,
                showDelete: !this.state.showDelete
            });
        }
    };

    getPlaylists = () => {
        axios
            .get('/api/playlists')
            .then(response => {
                this.props.onSetPlaylistsIds(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    deletePlaylist(playlistId) {
        axios
            .delete(`/api/playlists/${playlistId}`)
            .then(response => {
                this.getPlaylists();
            })
            .catch(error => console.log(error.response.data));
        this.toggleModalDelete(null);
    }

    componentDidMount() {
        this.getPlaylists();
    }

    render() {
        let playlists = null;
        let firstFourAlbums = [];

        // add cover picture to the playlists
        if (this.props.playlists) {
            playlists = this.props.playlists.map((playlist, idx) => {
                // grab the first 4 albums added to the playlist
                firstFourAlbums.push(playlist.albums.slice(-4));
                let imgStyle = { width: '225px', height: '225px' };

                if (firstFourAlbums[idx].length === 0) {
                    imgStyle = { width: '225px', height: '225px' };
                } else if (firstFourAlbums[idx].length < 4) {
                    imgStyle = {
                        ...imgStyle,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundImage: `url(${
                            firstFourAlbums[idx][
                                firstFourAlbums[idx].length - 1
                            ].albumImgURI
                        })`,
                        backgroundPosition: `center center`
                    };
                } else {
                    imgStyle = {
                        ...imgStyle,
                        backgroundSize: '50%',
                        backgroundRepeat: 'no-repeat',
                        backgroundImage: `url(${
                            firstFourAlbums[idx][0].albumImgURI
                        }),
                        url(${firstFourAlbums[idx][1].albumImgURI}),
                        url(${firstFourAlbums[idx][2].albumImgURI}),
                        url(${firstFourAlbums[idx][3].albumImgURI})`,
                        backgroundPosition: `0% 0%, 100% 0%, 100% 100%, 0% 100%`
                    };
                }

                return (
                    <div className={styles.Card} key={playlist._id}>
                        <Link to={'/playlist/' + playlist._id}>
                            <div
                                className={styles.PlaylistImg}
                                style={imgStyle}>
                                {firstFourAlbums[idx].length === 0 ? (
                                    <i className="fas fa-music" />
                                ) : null}
                            </div>
                        </Link>
                        <h2>{playlist.name}</h2>
                        <div>
                            <Button
                                btnType={'Delete'}
                                clicked={() =>
                                    this.toggleModalDelete(
                                        playlist._id,
                                        playlist.name
                                    )
                                }>
                                Delete
                            </Button>
                        </div>
                    </div>
                );
            });
        }
        return (
            <React.Fragment>
                {playlists}
                <Modal
                    show={this.state.showDelete}
                    clicked={() => this.toggleModalDelete(null)}>
                    <div className={styles.Modal}>
                        <h2>
                            Do you really want to delete{' '}
                            <span>{this.state.playlistName}</span> ?
                        </h2>
                        <div className={styles.Buttons}>
                            <Button
                                btnType={'PlaylistCancel'}
                                clicked={() => this.toggleModalDelete(null)}>
                                Cancel
                            </Button>
                            <Button
                                btnType={'DeletePlaylist'}
                                clicked={() => {
                                    this.deletePlaylist(this.state.playlistId);
                                }}
                                clicked2={this.props.notify}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        playlists: state.library.playlists
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetPlaylistsIds: playlists =>
            dispatch(actions.setPlaylistsIds(playlists))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlists);
