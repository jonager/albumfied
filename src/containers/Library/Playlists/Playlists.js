import React, { Component } from 'react';
import fire from '../../../fire';
import styles from './Playlists.css';

class Playlists extends Component {
    state = {
        playlists: null
    }

    getPlaylistsFirebase = (userid) => {
        let ref = fire.database().ref(`users/${userid}/playlists`);
        ref.on('value', (snapshot) => {
            this.setState({
                playlists: snapshot.val()
            })
        })
    }

    componentDidMount() {
        this.getPlaylistsFirebase('jagn29');
    }

    render() { 
        let playlists = null;
        if(this.state.playlists) {
            playlists = Object.keys(this.state.playlists).map(playlist => {
                return (
                    <div className={styles.Card}>
                        <div className={styles.PlalistImg} style={{width:'225px', height:'225px'}}>
                            <i class="fas fa-music"></i>
                        </div>
                        <h2>{playlist}</h2>
                    </div>
                )
            })
        }
        return ( playlists )
    }
}
 
export default Playlists;