import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {ToastContainer, ToastStore} from 'react-toasts';
import SearchBar from '../../components/UI/SearchBar/SearchBar';
import SearchResult from './SearchResult/SearchResult';
import axios from 'axios';

class Search extends Component {
    state = {
        token: localStorage.getItem('token'),
        results: null
    }

    static timeout = null

    notifyAdded = () => {
        ToastStore.success('Album has been saved to Your Music!');
    }
    
    searchItem = (token, searchQuery) => {
        axios({
            method:'get',
            url:'https://api.spotify.com/v1/search',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            params: {
                q: `${searchQuery}`,
                type: 'album,artist',
                market: 'US'
            }})
            .then( (response) => {
                this.setState({
                    results: response.data
                });
                this.props.history.push({
                    pathname: '/search/artists'
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    inputChangeHandler = event => {
        let token = this.state.token;
        event.persist();
        clearTimeout(Search.timeout);

        Search.timeout = setTimeout(() => {
            this.searchItem(token, event.target.value);
        }, 1000);
    };

    render() { 
        return (
            <div>
                <ToastContainer store={ToastStore} position={ToastContainer.POSITION.TOP_RIGHT}/>
                <SearchBar inputHandler={this.inputChangeHandler}/>
                {this.state.results 
                    ?<SearchResult 
                        albums={this.state.results.albums.items}
                        artists={this.state.results.artists.items}
                        notify={this.notifyAdded}/> 
                    : null}
            </div>

        );
    }
}
 
export default withRouter(Search);