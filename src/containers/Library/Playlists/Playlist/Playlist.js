import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'; 
import { connect } from 'react-redux';
import fire from '../../../../fire';
import styles from './Playlist.css';

class Playlist extends Component {
    state = { 
        albums: []
    };

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

    componentDidMount() {
        this.getAlbumsFirebase(this.props.userId, this.props.match.params.playlistName);
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
                <div>
                    <h1>{this.props.match.params.playlistName}</h1>
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
