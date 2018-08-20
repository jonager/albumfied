import React, { Component } from 'react';
import { connect } from 'react-redux';
import fire from '../../../fire';
import styles from './Playlists.css';
import * as actions from '../../../store/actions/index';
import { Link } from 'react-router-dom'; 
import Button from '../../../components/UI/Button/Button';
import Modal from '../../../components/UI/Modal/Modal';

class Playlists extends Component {
    // TODO: add cover to playlist
    state = {
        showDelete : false
    }

    togleModalDelete = () => {
        this.setState({
            showDelete: !this.state.showDelete
        });
    }

    getPlaylistsFirebase = (userId) => {
        this.ref = fire.database().ref(`users/${userId}/playlists`);
        this.ref.on('value', (snapshot) => {
            this.props.onSetPlaylistName(snapshot.val())
        })
    }

    deletePlaylist(userId, playlistName) {
        fire.database().ref(`users/${userId}`).child('playlists').child(playlistName).remove();
        this.togleModalDelete();
    }
    
    componentDidMount() {
        this.getPlaylistsFirebase(this.props.userId)
    }

    componentWillUnmount() {
        this.ref.off('value');
    }
    
    render() { 
        let playlists = null;
        if(this.props.playlists) {
            playlists = Object.keys(this.props.playlists).map(playlist => {
                return (
                    <div className={styles.Card} key={playlist}>
                        <Link to={'/playlist/' + playlist}>
                            <div className={styles.PlalistImg} style={{width:'225px', height:'225px'}}>
                                <i className="fas fa-music"></i>
                            </div>
                        </Link> 
                        <h2>{playlist}</h2>
                        <div>
                            <Button
                                btnType={'Delete'}
                                clicked={this.togleModalDelete}
                                >Delete</Button>
                        </div>
                        <Modal show={this.state.showDelete} clicked={this.togleModalDelete}>
                            <div className={styles.Modal}>
                                <h2>Do you really want to delete <span>{playlist}</span></h2>
                                <div className={styles.Buttons}>
                                    <Button
                                        btnType={'PlaylistCancel'}
                                        clicked={this.togleModalDelete}
                                        >Cancel</Button>
                                    <Button
                                        btnType={'DeletePlaylist'}
                                        clicked={() => {this.deletePlaylist(this.props.userId, playlist)}}
                                        >Delete</Button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                )
            })
        }
        return ( playlists )
    }
}

const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        playlists: state.library.playlists
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetPlaylistName: (playlists) => dispatch(actions.setPlaylistName(playlists))
    };
};
 
export default connect(mapStateToProps, mapDispatchToProps)(Playlists);