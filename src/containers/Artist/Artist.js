import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import styles from './Artist.css';
import Card from '../../components/UI/Card/Card';

class Artist extends Component {
    state = {
        artist: null,
        relatedArtists: null,
        albums: null
    }

    apiCalls = () => {
        let artistId = this.props.match.params.id;
        let token = this.props.token;
        this.getAlbums(artistId, token);
        this.getRelatedArtist(artistId, token);
        this.getArtist(artistId, token);
    }

    getArtist = (artistId, token) => {
        axios({
            method:'get',
            url:`https://api.spotify.com/v1/artists/${artistId}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
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
        
    getAlbums = (artistId, token) => {
        axios({
            method: 'get',
            url: `https://api.spotify.com/v1/artists/${artistId}/albums`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            params: {
                market: 'US',
                limit: 20,
                offset: 0
            }
        })
        .then((response) => {
            this.setState({
                albums: response.data
            });
        })
        .catch((error) => {
            console.log(error);
        });
    };
    
    getRelatedArtist = (artistId, token) => {
        axios({
            method:'get',
            url:`https://api.spotify.com/v1/artists/${artistId}/related-artists`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }})
            .then( (response) => {
                this.setState({
                    relatedArtists: response.data
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    componentDidMount() {
        this.apiCalls();
    }

    componentDidUpdate(prevProps) {
        if(this.props.match.params.id !== prevProps.match.params.id){
            this.apiCalls();
        }
    }

    render() {
        let albumsCard, relatedArtistsCard, artistName, artistFollowers = null

        if (this.state.artist) {
            artistName = <h1>{this.state.artist.name}</h1>;
            artistFollowers= <p>{`Followers: ${this.state.artist.followers.total.toLocaleString('en')}`}</p>;
        }

        albumsCard = this.state.albums ? <Card results={this.state.albums.items} /> : null;
        relatedArtistsCard = this.state.relatedArtists ? <Card results={this.state.relatedArtists.artists} /> : null;

        return (
            <div className={styles.Artist}>
                <div className={styles.ArtistInfo}>
                    {artistName}
                    {artistFollowers}
                </div>
                <h2>Albums</h2>
                <div className={`${styles.Cards} ${styles.FirstCard}`}>
                    {albumsCard}    
                </div>
                <h2>Related Albums</h2>
                <div className={styles.Cards}>
                    {relatedArtistsCard}   
                </div>
            </div>
        );
    }
}

export default withRouter(Artist);