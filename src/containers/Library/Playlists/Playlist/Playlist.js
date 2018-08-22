import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'; 
import {ToastContainer, ToastStore} from 'react-toasts';
import { connect } from 'react-redux';
import fire from '../../../../fire';
import styles from './Playlist.css';
import Button from '../../../../components/UI/Button/Button';

class Playlist extends Component {
    state = { 
        albums: [],
        playlistName: this.props.match.params.playlistName
    };

    notifyRemoved = (playlistName) => {
        ToastStore.error(`Album has been removed from ${playlistName}!`);
    }

    getAlbumsFirebase = (userId, playlistName) => {
        this.ref = fire.database().ref(`users/${userId}/playlists/${playlistName}`);
        this.ref.on('value', (snapshot) => {
            let albums = snapshot.val();
            
            delete albums['album'];
            this.setState({
                albums: Object.values(albums)
            });
        })
    }

    deleteAlbum(userId, playlistName, albumId) {
        let albumRef = fire.database().ref(`users/${userId}/playlists/${playlistName}`)
        albumRef.orderByChild('albumId').equalTo(albumId).once('value', snapshot => {
            let updates= {}
            snapshot.forEach(child => updates[child.key] = null);
            albumRef.update(updates);
        });
    }

    componentDidMount() {
        this.getAlbumsFirebase(this.props.userId, this.state.playlistName);
    }

    componentWillUnmount() {
        this.ref.off('value');
    }

    render() {
        let albums = null;
        let message = null;

        if(this.state.albums.length !== 0) {
            albums = this.state.albums.map(album => {
                return (
                    <div key={album.albumId} className={styles.Card}>
                        <img style={{width:'225px', height: '225px'}} 
                            src={album.albumImg} 
                            alt="Album/Artist"/>
                        <div className={styles.Info}>
                            <Link to={'/artist/' + album.artistId} title={album.artistName}>{album.artistName}</Link> 
                            <Link to={'/album/' + album.albumId} title={album.albumName}>{album.albumName}</Link>
                        </div>
                        <div>
                            <Button
                                btnType={'Delete'}
                                clicked={() => {this.deleteAlbum(this.props.userId, this.state.playlistName, album.albumId)}}
                                clicked2={() => {this.notifyRemoved(this.state.playlistName)}}
                                >Delete</Button>
                        </div>
                    </div>
                )
            })
        } else {
            message = 
                <React.Fragment>
                    <p>Ooop! Your playlist seems to be empty.</p>
                    <p><Link to={'/search'}>Search for your favorite albums and add them to {this.props.match.params.playlistName}</Link></p>
                </React.Fragment>
        }
        
        return (
            <div className={styles.Playlist}>
                <ToastContainer store={ToastStore} position={ToastContainer.POSITION.TOP_RIGHT}/>
                <div>
                    <h1>{this.state.playlistName}</h1>
                    <div className={styles.EmptyPlaylist}>
                        {message}   
                    </div>
                </div>
                <div className={styles.Cards}>
                    {albums}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userId: state.auth.userId
    }
};

export default withRouter(connect(mapStateToProps)(Playlist));
