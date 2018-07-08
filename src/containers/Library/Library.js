import React, { Component } from 'react';
import { NavLink, Route, withRouter } from 'react-router-dom'; 
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import fire from '../../fire';


import Card from '../../components/UI/Card/Card';
import styles from './Library.css';
import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import Playlists from './Playlists/Playlists';

class Library extends Component {
    state = {
        totalAlbums: null,
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

    getAlbums = (token) => {
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
            this.setState({
                totalAlbums: response.data
            })
            this.props.history.push({
                pathname: '/library/albums'
            });
        })
        .catch((error) => {
            console.log(error);
        });
    };

    addPlaylistFirebase = (userId, playlistName) => {
        fire.database().ref(`users/${userId}`).child('playlists').child(playlistName).set({
            album: 0
        });
    };

    // addAlbumFirebase = (userId, playlistName, album) => {
    //     fire.database().ref(`users/${userId}/playlists/${playlistName}`).push({
    //         name: album
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
        this.getAlbums(token);
    }

    render() {
        console.log(this.state.show)
        let totalAlbums = null;
        totalAlbums = this.state.totalAlbums ? this.state.totalAlbums.items: null;

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
                    {this.state.totalAlbums 
                        ? <Route  path="/library/albums" render={() =>  <Card totalAlbums={true} results={totalAlbums} />}/> 
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
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetPlaylistName: (libraryName) => dispatch(actions.setPlaylistName(libraryName))
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Library));