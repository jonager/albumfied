import React, { Component } from 'react';
import { connect } from 'react-redux';
import fire from '../../../fire';
import styles from './Playlists.css';
import * as actions from '../../../store/actions/index';
import { Link } from 'react-router-dom'; 

class Playlists extends Component {
    // TODO: add option to delete playlists
    getPlaylistsFirebase = (userid) => {
        let ref = fire.database().ref(`users/${userid}/playlists`);
        ref.on('value', (snapshot) => {
            this.props.onSetPlaylistName(snapshot.val())
        })
    }

    componentDidMount() {
        this.getPlaylistsFirebase('jagn29');
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
                    </div>
                )
            })
        }
        return ( playlists )
    }
}

const mapStateToProps = state => {
    return {
        playlists: state.library.playlists
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetPlaylistName: (playlists) => dispatch(actions.setPlaylistName(playlists))
    };
};
 
export default connect(mapStateToProps, mapDispatchToProps)(Playlists);