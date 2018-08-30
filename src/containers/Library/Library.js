import React, { Component } from 'react';
import { NavLink, Route, withRouter } from 'react-router-dom'; 
import {ToastContainer, ToastStore} from 'react-toasts';
import Waypoint from 'react-waypoint';
import axios from 'axios';
import { connect } from 'react-redux';
import fire from '../../fire';
import * as actions from '../../store/actions/index';

import Card from '../../components/UI/Card/Card';
import styles from './Library.css';
import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import Playlists from './Playlists/Playlists';
// https://albumfied.firebaseapp.com/callback
class Library extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAdd: false,
            showPlaylist: false,
            albumToAdd: {}
        }

        this.inputRef = React.createRef();
    }    

    togleModalAdd = () => {
        this.setState({
            showAdd: !this.state.showAdd
        });
    }

    togleModalPlayist = () => {
        this.setState({
            showPlaylist: !this.state.showPlaylist
        });
    }

    notifyDelete = () => {
        ToastStore.error('Album has been removed from Your Music!');
    }
    notifyDeletePlaylist = () => {
        ToastStore.error('Playlist has been deleted!');
    }

    notifyAdded = (playlistName) => {
        ToastStore.success(`Album has been added to ${playlistName}!`);
    }

    inputHandler = (e) => {
        if(e.keyCode === 13) {
            this.checkPlaylistExists(this.props.userId, e.target.value);
            this.setState({
                showAdd: false
            });
            e.target.value = '';
        }
    };

    focusInputModal() {
        // Explicitly focus the text input using the raw DOM API
        // Note: we're accessing "current" to get the DOM node
        this.inputRef.current.focus();
    }

    getAlbumsSpotify = (token, offset) => {
        axios({
            method: 'get',
            url: `https://api.spotify.com/v1/me/albums`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            params: {
                market: 'US',
                limit: 50,
                offset: offset
            }
        })
        .then((response) => {
            this.props.onSetTotalAlbums(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    deleteAlbumSpotify = (token, albumId, addedTime) => {
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
            this.props.deleteAlbumFromStore(addedTime);
        })
    };

    addPlaylistFirebase = (userId, playlistName) => {
        fire.database().ref(`users/${userId}`).child('playlists').child(playlistName).set({
            album: 0
        });
        this.props.history.push({
            pathname: `/playlist/${playlistName}`
        });
    };

    checkPlaylistExists = (userId, playlistName) => {
        const playlistsRef = fire.database().ref(`users/${userId}/playlists`);        
        playlistsRef.child(playlistName).once('value', (snapshot) => {
            if (!snapshot.exists()) {
                this.addPlaylistFirebase(userId, playlistName);
            } 
        });
    };

    getPlaylistsFirebase = (userid) => {
        this.ref = fire.database().ref(`users/${userid}/playlists`);
        this.ref.on('value', (snapshot) => {
            this.props.onSetPlaylistName(snapshot.val())
        })
    }

    addAlbumFirebase = (userId, playlistName, albumToAdd) => {
        fire.database().ref(`users/${userId}/playlists/${playlistName}`).push({
            albumName: albumToAdd.albumName,
            artistName: albumToAdd.artistName,
            albumId: albumToAdd.albumId,
            artistId: albumToAdd.artistId,
            albumImg: albumToAdd.albumImg
        });
    };

    checkAlbumExists = (userId, playlistName, albumToAdd) => {
        const albumRef = fire.database().ref(`users/${userId}/playlists/${playlistName}`);        
        albumRef.orderByChild('albumId').equalTo(albumToAdd.albumId).once('value', (snapshot) => {
            if (!snapshot.exists()) {
                this.addAlbumFirebase(userId, playlistName, albumToAdd);
            } 
        });
        this.togleModalPlayist();
    };

    deleteAlbum = (userId, playlistName, albumId) => {
        let albumRef = fire.database().ref(`users/${userId}/playlists/${playlistName}`)
        albumRef.orderByChild('albumId').equalTo(albumId).once('value', snapshot => {
            let updates= {}
            snapshot.forEach(child => updates[child.key] = null);
            albumRef.update(updates);
        });
    }

    albumToAdd = (albumName, artistName, albumId, artistId, albumImg) => {
        this.setState({
            albumToAdd: {
                albumName: albumName,
                artistName: artistName,
                albumId: albumId,
                artistId: artistId,
                albumImg:albumImg
            }
        })
    };

    componentDidMount() {
        this.getPlaylistsFirebase(this.props.userId);
        this.props.history.push({
            pathname: '/library/albums'
        });
    }

    componentWillUnmount() {
        this.ref.off('value');
    }

    componentDidUpdate(prevState) {
        if(this.state.showAdd !== prevState.showAdd) {
            this.focusInputModal();
        }
    }
   
    render() {
        let totalAlbums = null;
        totalAlbums = this.props.totalAlbums ? this.props.totalAlbums: null;

        let playlists = null;
        if(this.props.playlists) {
            playlists = Object.keys(this.props.playlists).map(playlist => {
                return (
                    <div key={playlist + new Date().getTime()}>
                        <a onClick={() => {
                                this.checkAlbumExists(this.props.userId, playlist, this.state.albumToAdd)}}>
                            <div onClick={() => {this.notifyAdded(playlist)}} className={styles.PlalistImg} style={{width:'250px', height:'250px'}}>
                                <i className="fas fa-music"></i>
                            </div>
                        </a>
                        <h2>{playlist}</h2>
                    </div>
                )
            })
        }

        return (
            <div className={styles.Library}>
                <div  className={styles.LibraryLinks}>
                    <ToastContainer store={ToastStore} position={ToastContainer.POSITION.TOP_RIGHT}/>
                    <NavLink 
                        activeStyle={{color:'#1db954', borderBottom: '#7DCE82 4px inset'}} 
                        to="/library/albums">My Albums</NavLink>
                    <NavLink 
                        activeStyle={{color:'#1db954', borderBottom: '#7DCE82 4px inset'}}  
                        to="/library/playlists">Playlists</NavLink>
                    <Button
                        btnType={'Login-Hero'}
                        clicked={this.togleModalAdd}
                        >New Playlist</Button>
                </div>

                <div className={styles.Cards}>
                    <Route path="/library/playlists" render={() => <Playlists notify={this.notifyDeletePlaylist} />} />
                    {this.props.totalAlbums 
                        ? <Route  path="/library/albums" render={() =>  
                            <Card 
                                totalAlbums={true} 
                                clicked={this.deleteAlbumSpotify} 
                                clicked2={this.albumToAdd}
                                togleModal={this.togleModalPlayist}
                                token={this.props.token} 
                                delete={true} 
                                playlist={true}
                                results={totalAlbums}
                                notifyDelete={this.notifyDelete} />}/> 
                        : null}
                </div>

                <Modal show={this.state.showAdd} clicked={this.togleModalAdd}>
                    <h1>Create new playlist</h1>
                    <input 
                        className={styles.PlaylistInput} 
                        onKeyDown={this.inputHandler} 
                        placeholder="Playlist name" type="text" 
                        ref={this.inputRef}></input>
                    <Button
                        btnType={'PlaylistCancel'}
                        clicked={this.togleModalAdd}
                        >Cancel</Button>
                </Modal>
                <Modal show={this.state.showPlaylist} clicked={this.togleModalPlayist}>
                    <div className={styles.Cards}>
                        {playlists}
                    </div>
                </Modal>
                <Waypoint
                    onEnter={() => this.getAlbumsSpotify(this.props.token, this.props.offset)}
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
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetTotalAlbums: (totalAlbums) => dispatch(actions.setTotalAlbums(totalAlbums)),
        deleteAlbumFromStore: (addedTime) => dispatch (actions.deleteAlbumFromStore(addedTime)),
        onSetPlaylistName: (playlists) => dispatch(actions.setPlaylistName(playlists))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Library));