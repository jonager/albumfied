import React, { Component } from 'react';
import { NavLink, Route, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import Waypoint from 'react-waypoint';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

import Card from '../../components/UI/Card/Card';
import styles from './Library.css';
import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import Playlists from './Playlists/Playlists';
import * as utility from '../../shared/utility';

class Library extends Component {
    state = {
        showAdd: false,
        showPlaylist: false,
        albumToAdd: {}
    };

    inputRef = React.createRef();

    toggleModalAdd = () => {
        this.setState({
            showAdd: !this.state.showAdd
        });
    };

    toggleModalPlaylist = () => {
        this.setState({
            showPlaylist: !this.state.showPlaylist
        });
    };

    notifyDelete = () => {
        toast.error('Album has been removed from Your Music!');
    };
    notifyDeletePlaylist = () => {
        toast.error('Playlist has been deleted!');
    };

    notifyAdded = () => {
        toast.success(`Album has been added to the playlist!`);
    };

    inputHandler = e => {
        if (e.keyCode === 13) {
            let name = e.target.value.trim();

            if (name.length > 0) {
                this.createPlaylist(e.target.value);
                this.setState({
                    showAdd: false
                });
                e.target.value = '';
            } else {
                toast.info("Playlist name can't be empty");
            }
        }
    };

    focusInputModal() {
        // Explicitly focus the text input using the raw DOM API
        // Note: we're accessing "current" to get the DOM node
        this.inputRef.current.focus();
    }

    getAlbumsSpotify = offset => {
        axios
            .get(`/api/spotify/albums/${offset}`)
            .then(response => {
                this.props.onSetTotalAlbums(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    deleteAlbumSpotify = albumSpotifyId => {
        axios
            .delete(`/api/spotify/albums/${albumSpotifyId}`)
            .then(response => {
                this.notifyDelete();
                this.props.onDeleteAlbumFromStore(albumSpotifyId);
            })
            .catch(error => console.log(error));
    };

    createPlaylist = name => {
        axios
            .post('/api/playlists', { name: name })
            .then(response => {
                this.props.history.push({
                    pathname: `/playlist/${name}`
                });
            })
            .catch(error => {
                if (error.response.status === 400) {
                    toast.info(error.response.data.nameTaken);
                }
            });
    };

    getPlaylists = () => {
        axios
            .get('/api/playlists')
            .then(response => {
                this.props.onSetPlaylistsIds(response.data);
            })
            .catch(error => error.response.data);
    };

    addAlbum = (playlistId, albumToAdd) => {
        axios
            .post('/api/playlists/album', {
                playlistId: playlistId,
                albumToAdd: albumToAdd
            })
            .then(response => {
                this.getPlaylists(); // run again, so playlists cover in modal get updated
                this.notifyAdded();
                this.toggleModalPlaylist();
            })
            .catch(error => {
                if (error.response.status === 400) {
                    toast.info(error.response.data.albumexists);
                }
                this.toggleModalPlaylist();
            });
    };

    albumToAdd = (
        albumName,
        artistName,
        albumSpotifyId,
        artistId,
        albumImg
    ) => {
        this.setState({
            albumToAdd: {
                albumName: albumName,
                artistName: artistName,
                albumSpotifyId: albumSpotifyId,
                artistId: artistId,
                albumImgURI: albumImg
            }
        });
    };

    componentDidMount() {
        this.getPlaylists();
        this.props.history.push({
            pathname: '/library/albums'
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.location.pathname === prevProps.match.path) {
            this.props.history.push({
                pathname: '/library/albums'
            });
        }
        if (this.state.showAdd !== prevState.showAdd) {
            this.focusInputModal();
        }
    }

    render() {
        let totalAlbums = null;
        totalAlbums = this.props.totalAlbums ? this.props.totalAlbums : null;

        let playlists = null;
        if (this.props.playlists) {
            playlists = this.props.playlists.map(playlist => {
                // get cover pictures for the playlist
                let coverStyling = utility.getCoverStyling(playlist);
                return (
                    <div key={playlist._id}>
                        <a
                            onClick={() => {
                                this.addAlbum(
                                    playlist._id,
                                    this.state.albumToAdd
                                );
                            }}>
                            <div
                                className={styles.PlaylistImg}
                                style={coverStyling}>
                                {playlist.albums.length === 0 ? (
                                    <i className="fas fa-music" />
                                ) : null}
                            </div>
                        </a>
                        <h2>{playlist.name}</h2>
                    </div>
                );
            });
        }

        return (
            <div className={styles.Library}>
                <div className={styles.LibraryLinks}>
                    <NavLink
                        activeStyle={{
                            color: '#1db954',
                            borderBottom: '#7DCE82 4px inset'
                        }}
                        to="/library/albums">
                        My Albums
                    </NavLink>
                    <NavLink
                        activeStyle={{
                            color: '#1db954',
                            borderBottom: '#7DCE82 4px inset'
                        }}
                        to="/library/playlists">
                        Playlists
                    </NavLink>
                    <Button
                        btnType={'Login-Hero'}
                        clicked={this.toggleModalAdd}>
                        New Playlist
                    </Button>
                </div>

                <div className={styles.Cards}>
                    <Route
                        path="/library/playlists"
                        render={() => (
                            <Playlists notify={this.notifyDeletePlaylist} />
                        )}
                    />
                    {this.props.totalAlbums ? (
                        <Route
                            path="/library/albums"
                            render={() => (
                                <Card
                                    totalAlbums={true}
                                    clicked={this.deleteAlbumSpotify}
                                    clicked2={this.albumToAdd}
                                    togleModal={this.toggleModalPlaylist}
                                    delete={true}
                                    playlist={true}
                                    results={totalAlbums}
                                />
                            )}
                        />
                    ) : null}
                </div>

                <Modal show={this.state.showAdd} clicked={this.toggleModalAdd}>
                    <h1>Create new playlist</h1>
                    <input
                        className={styles.PlaylistInput}
                        onKeyDown={this.inputHandler}
                        placeholder="Playlist name"
                        type="text"
                        ref={this.inputRef}
                    />
                    <Button
                        btnType={'PlaylistCancel'}
                        clicked={this.toggleModalAdd}>
                        Cancel
                    </Button>
                </Modal>
                <Modal
                    show={this.state.showPlaylist}
                    clicked={this.toggleModalPlaylist}>
                    <div className={styles.Cards}>{playlists}</div>
                </Modal>
                <Waypoint
                    onEnter={() => this.getAlbumsSpotify(this.props.offset)}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        token: state.auth.spotifyToken,
        totalAlbums: state.library.totalAlbums,
        playlists: state.library.playlists,
        offset: state.library.offset
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetTotalAlbums: totalAlbums =>
            dispatch(actions.setTotalAlbums(totalAlbums)),
        onDeleteAlbumFromStore: albumSpotifyId =>
            dispatch(actions.deleteAlbumFromStore(albumSpotifyId)),
        onSetPlaylistsIds: playlists =>
            dispatch(actions.setPlaylistsIds(playlists))
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Library)
);
