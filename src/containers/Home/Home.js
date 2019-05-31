import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Card from '../../components/UI/Card/Card';
import styles from './Home.css';
import axios from 'axios';
import * as actions from '../../store/actions/index';

class Home extends Component {
    state = {
        newReleases: null
    };

    _isMounted = false;

    notifyAdded = () => toast.success('Album has been saved to Your Music!');

    getNewReleases = () => {
        axios
            .get('/api/spotify/new-releases')
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        newReleases: response.data
                    });
                }
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
        this._isMounted = true;
        this.getNewReleases();
    }

    componentWillUnmount() {
        this._isMounted = false;
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
