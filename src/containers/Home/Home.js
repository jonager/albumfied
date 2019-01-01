import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastContainer, ToastStore } from 'react-toasts';
import Card from '../../components/UI/Card/Card';
import styles from './Home.css';
import axios from 'axios';
import * as actions from '../../store/actions/index';

class Home extends Component {
    state = {
        newReleases: null
    };

    notifyAdded = () => {
        ToastStore.success('Album has been saved to Your Music!');
    };

    getNewReleases = () => {
        axios
            .get('/api/spotify/new-releases')
            .then(response => {
                this.setState({
                    newReleases: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    saveAlbumSpotify = albumId => {
        axios
            .put(`/api/spotify/albums/save/${albumId}`)
            .then(response => {
                this.notifyAdded();
                this.props.onResetLibraryStore();
            })
            .catch(response => console.log(response));
    };

    componentDidMount() {
        this.getNewReleases();
    }

    render() {
        let newReleases = null;
        newReleases = this.state.newReleases ? (
            <Card
                results={this.state.newReleases.albums.items.filter(
                    item => item.album_type === 'album'
                )}
                save={true}
                clicked={this.saveAlbumSpotify}
            />
        ) : null;

        return (
            <div className={styles.Home}>
                <ToastContainer
                    store={ToastStore}
                    position={ToastContainer.POSITION.TOP_RIGHT}
                />
                <h1>New Releases</h1>
                <div className={styles.Cards}>{newReleases}</div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onResetLibraryStore: () => dispatch(actions.resetLibraryStore())
    };
};

export default connect(
    null,
    mapDispatchToProps
)(Home);
