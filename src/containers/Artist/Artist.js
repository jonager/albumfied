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

    componentDidMount() {
        let artistId = this.props.match.params.id;
        let token = this.props.token;
        this.getAlbums(artistId, token);
        this.getRelatedArtist(artistId, token);
        this.getArtist(artistId, token);
    }

    render() {
        let albumsCard, relatedArtistsCard, artistName, artistFollowers = null

        if (this.state.artist) {
            artistName = <h1>{this.state.artist.name}</h1>;
            artistFollowers= <p>{`Followers: ${this.state.artist.followers.total.toLocaleString('en')}`}</p>;
        }

        if (this.state.albums) {
            albumsCard = <Card results={this.state.albums.items} />
        }
        
        if (this.state.relatedArtists) {
            relatedArtistsCard = <Card results={this.state.relatedArtists.artists} />
        }

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