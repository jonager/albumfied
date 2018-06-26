import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class Artist extends Component {
    state = {
        artist: null
    }

    searchAlbum = (artistId, token) => {
        axios({
            method:'get',
            url:`https://api.spotify.com/v1/artists/${artistId}/albums`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            params: {
                market: 'US',
                limit: 20,
                offset: 0
            }})
            .then( (response) => {
                console.log(response.data)
                this.setState({
                    artist: response.data
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    componentDidMount() {
        let artistId = this.props.match.params.id;
        let token = this.props.token;
        this.searchAlbum(artistId, token);
    }   

    render() { 
        let card = null;
        
        if(this.state.artist){
            card = this.art
        }

        return ( <p>hola</p> )
    }
}
 
export default withRouter(Artist);