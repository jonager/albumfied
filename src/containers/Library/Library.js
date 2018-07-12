import React, { Component } from 'react';
import { NavLink, Route, withRouter } from 'react-router-dom'; 
import axios from 'axios';
import { connect } from 'react-redux';
import fire from '../../fire';
import * as actions from '../../store/actions/index';

import Card from '../../components/UI/Card/Card';
import styles from './Library.css';
import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import Playlists from './Playlists/Playlists';

class Library extends Component {
    state = {
        showAdd: false,
        showPlaylist: false
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

    inputHandler = (e) => {
        if(e.keyCode === 13) {
            this.addPlaylistFirebase(this.props.userId, e.target.value);
            this.setState({
                showAdd: false
            });
            e.target.value = '';
        }
    };

    getAlbumsSpotify = (token) => {
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
                limit:  50,
                offset: 0
            }
        })
        .then((response) => {
            this.props.onSetTotalAlbums(response.data);
            this.props.history.push({
                pathname: '/library/albums'
            });
        })
        .catch((error) => {
            console.log(error);
        });
    };

    deleteAlbumSpotify = (token, albumId) => {
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
            this.getAlbumsSpotify(this.props.token)
        })
    };

    addPlaylistFirebase = (userId, playlistName) => {
        fire.database().ref(`users/${userId}`).child('playlists').child(playlistName).set({
            album: 0
        });
    };

    getPlaylistsFirebase = (userid) => {
        let ref = fire.database().ref(`users/${userid}/playlists`);
        ref.on('value', (snapshot) => {
            this.props.onSetPlaylistName(snapshot.val())
        })
    }

    addAlbumFirebase = (userId, playlistName, albumName, artistId, albumId) => {
        fire.database().ref(`users/${userId}/playlists/${playlistName}`).push({
            albumName: albumName,
            albumId: albumId,
            artistId: artistId
        });
    };

    getAlbumsFirebase = (userid, playlistName) => {
        let ref = fire.database().ref(`users/${userid}/playlists/${playlistName}`);
        ref.on('value', function(snapshot){
            console.log(snapshot.val());
        })
    }

    componentDidMount() {
        let token = this.props.token;
        this.getAlbumsSpotify(token);
        this.getPlaylistsFirebase(this.props.userId);
        // this.addAlbumFirebase(this.props.userId, 'rock', 'Last Train to Lhasa', '7sP5xGJkeSPmAAcf2ufkfV', '5Z8mapYkacgBN46TkH9L3M')
        // this.getAlbumsFirebase(this.props.userId, 'rock')
    }
   
    render() {
        let totalAlbums = null;
        totalAlbums = this.props.totalAlbums ? this.props.totalAlbums.items: null;

        let playlists = null;
        if(this.props.playlists) {
            playlists = Object.keys(this.props.playlists).map(playlist => {
                return (
                    <div>
                        <div className={styles.PlalistImg} style={{width:'250px', height:'250px'}}>
                            <i className="fas fa-music"></i>
                        </div>
                        <h2>{playlist}</h2>
                    </div>
                )
            })
        }

        return (
            <div className={styles.Library}>
                <div  className={styles.LibraryLinks}>
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
                    <Route path="/library/playlists" render={() => <Playlists />} />
                    {this.props.totalAlbums 
                        ? <Route  path="/library/albums" render={() =>  
                            <Card 
                                totalAlbums={true} 
                                clicked={this.deleteAlbumSpotify} 
                                clicked2={this.togleModalPlayist}
                                token={this.props.token} 
                                delete={true} 
                                playlist={true}
                                results={totalAlbums} />}/> 
                        : null}
                </div>
                <Modal show={this.state.showAdd} clicked={this.togleModalAdd}>
                    <h1>Create new playlist</h1>
                    <input className={styles.PlaylistInput} 
                        onKeyDown={this.inputHandler} 
                        placeholder="Playlist name" type="text" 
                        autoFocus></input>
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
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        token: state.auth.spotifyToken,
        totalAlbums: state.library.totalAlbums,
        playlists: state.library.playlists
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetTotalAlbums: (totalAlbums) => dispatch(actions.setTotalAlbums(totalAlbums)),
        onSetPlaylistName: (playlists) => dispatch(actions.setPlaylistName(playlists))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Library));