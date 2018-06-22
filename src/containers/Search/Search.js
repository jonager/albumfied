import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import SearchBar from '../../components/UI/SearchBar/SearchBar';
import SearchResult from './SearchResult/SearchResult';
import axios from 'axios';

class Search extends Component {
    state = {
        token: localStorage.getItem('token'),
        results: null
    }

    static timeout = null
    
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
        }, 1500);
    };

    render() { 
        return (
            <div>
                <SearchBar inputHandler={this.inputChangeHandler}/>
                {this.state.results ? <SearchResult results={this.state.results}/> : null}
            </div>

        );
    }
}
 
export default withRouter(Search);