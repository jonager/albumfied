import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Playlists.css';
import * as actions from '../../../store/actions/index';
import { Link } from 'react-router-dom';
import Button from '../../../components/UI/Button/Button';
import Modal from '../../../components/UI/Modal/Modal';
import axios from 'axios';
import * as utility from '../../../shared/utility';

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

        if (this.props.playlists) {
            playlists = this.props.playlists.map((playlist, idx) => {
                // get cover pictures for the playlist
                let coverStyling = utility.getCoverStyling(playlist);

                return (
                    <div className={styles.Card} key={playlist._id}>
                        <Link to={'/playlist/' + playlist._id}>
                            <div
                                className={styles.PlaylistImg}
                                style={coverStyling}>
                                {playlist.albums.length === 0 ? (
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
