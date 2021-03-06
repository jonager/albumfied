import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import SearchBar from '../../components/UI/SearchBar/SearchBar';
import SearchResult from './SearchResult/SearchResult';
import axios from 'axios';
import * as actions from '../../store/actions/index';

class Search extends Component {
    state = {
        results: null
    };

    timeout = null;

    notifyAdded = () => {
        toast.success('Album has been saved to Your Music!');
    };

    searchItem = searchQuery => {
        axios
            .get(`/api/spotify/search/${searchQuery}`)
            .then(response => {
                this.setState({
                    results: response.data
                });
                this.props.history.push({
                    pathname: '/search/artists'
                });
            })
            .catch(error => {
                if (error.response.status === 404) {
                    toast.info(error.response.data.nofound);
                }
            });
    };

    inputChangeHandler = event => {
        event.persist();
        clearTimeout(Search.timeout);
        if (event.target.value.length === 0) {
            toast.info("Album/Artist name can't be empty.");
            return;
        }
        Search.timeout = setTimeout(() => {
            this.searchItem(event.target.value);
        }, 1000);
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

    render() {
        return (
            <div>
                <SearchBar inputHandler={this.inputChangeHandler} />
                {this.state.results ? (
                    <SearchResult
                        albums={this.state.results.albums.items}
                        artists={this.state.results.artists.items}
                        saveAlbumSpotify={this.saveAlbumSpotify}
                    />
                ) : null}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onResetLibraryStore: () => dispatch(actions.resetLibraryStore())
    };
};

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(Search)
);
