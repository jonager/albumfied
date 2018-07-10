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
        show: false
    }

    showModal = () => {
        this.setState({
            show: true
        });
    }

    hideModal = () => {
        this.setState({
            show: false
        });
    };

    inputHandler = (e) => {
        if(e.keyCode === 13) {
            this.addPlaylistFirebase(this.props.userId, e.target.value);
            this.setState({
                show: false
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

    // addAlbumFirebase = (userId, playlistName, album) => {
    //     fire.database().ref(`users/${userId}/playlists/${playlistName}`).push({
    //         name: album,
    //         artist: artist,
    //         albumId: albumId
    //     });
    // };

    // getAlbumsFirebase = (userid, playlistName) => {
    //     let ref = fire.database().ref(`users/${userid}/playlists/${playlistName}`);
    //     ref.on('value', function(snapshot){
    //         console.log(snapshot.val());
    //     })
    // }

    componentDidMount() {
        let token = this.props.token;
        this.getAlbumsSpotify(token);
    }
   
    render() {
        let totalAlbums = null;
        totalAlbums = this.props.totalAlbums ? this.props.totalAlbums.items: null;

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
                        clicked={this.showModal}
                        >New Playlist</Button>
                </div>

                <div className={styles.Cards}>
                    <Route path="/library/playlists" render={() => <Playlists />} />
                    {this.props.totalAlbums 
                        ? <Route  path="/library/albums" render={() =>  
                            <Card 
                                totalAlbums={true} 
                                clicked={this.deleteAlbumSpotify} 
                                token={this.props.token} 
                                delete={true} 
                                results={totalAlbums} />}/> 
                        : null}
                </div>
                <Modal show={this.state.show} clicked={this.hideModal}>
                    <h1>Create new playlist</h1>
                    <input className={styles.PlaylistInput} 
                        onKeyDown={this.inputHandler} 
                        placeholder="Playlist name" type="text" 
                        autoFocus></input>
                    <Button
                        btnType={'PlaylistCancel'}
                        clicked={this.hideModal}
                        >Cancel</Button>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        token: state.auth.spotifyToken,
        totalAlbums: state.library.totalAlbums
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetTotalAlbums: (totalAlbums) => dispatch(actions.setTotalAlbums(totalAlbums))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Library));