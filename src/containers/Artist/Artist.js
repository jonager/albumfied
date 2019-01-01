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
    };

    apiCalls = () => {
        let artistId = this.props.match.params.id;
        this.getAlbums(artistId);
        this.getRelatedArtist(artistId);
        this.getArtist(artistId);
    };

    getArtist = artistId => {
        axios
            .get(`/api/spotify/artists/${artistId}`)
            .then(response => {
                this.setState({
                    artist: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    getAlbums = artistId => {
        axios
            .get(`/api/spotify/artists/${artistId}/albums`)
            .then(response => {
                this.setState({
                    albums: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    getRelatedArtist = artistId => {
        axios
            .get(`/api/spotify/artists/${artistId}/related-artists`)
            .then(response => {
                this.setState({
                    relatedArtists: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    componentDidMount() {
        this.apiCalls();
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.apiCalls();
        }
    }

    render() {
        let albumsCard,
            relatedArtistsCard,
            artistName,
            artistFollowers = null;

        if (this.state.artist) {
            artistName = <h1>{this.state.artist.name}</h1>;
            artistFollowers = (
                <p>{`Followers: ${this.state.artist.followers.total.toLocaleString(
                    'en'
                )}`}</p>
            );
        }

        albumsCard = this.state.albums ? (
            <Card results={this.state.albums.items} />
        ) : null;
        relatedArtistsCard = this.state.relatedArtists ? (
            <Card results={this.state.relatedArtists.artists} />
        ) : null;

        return (
            <div className={styles.Artist}>
                <div
                    className={styles.ArtistInfo}
                    style={
                        this.state.artist
                            ? {
                                  backgroundImage: `linear-gradient(to right bottom, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),url("${
                                      this.state.artist.images[0].url
                                  }")`
                              }
                            : null
                    }>
                    {artistName}
                    {artistFollowers}
                </div>
                <h2>Albums</h2>
                <div className={`${styles.Cards} ${styles.FirstCard}`}>
                    {albumsCard}
                </div>
                <h2>Related Albums</h2>
                <div className={styles.Cards}>{relatedArtistsCard}</div>
            </div>
        );
    }
}

export default withRouter(Artist);
