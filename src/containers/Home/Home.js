import React, { Component } from 'react';
import Card from '../../components/UI/Card/Card';
import styles from './Home.css';
import axios from 'axios';

class Home extends Component {
    state ={
        newReleases: null
    }

    getNewReleases = (token) => {
        axios({
            method: 'get',
            url: `https://api.spotify.com/v1/browse/new-releases`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            params: {
                country: 'US',
            }
        })
        .then((response) => {
            this.setState({
                newReleases: response.data
            });
        })
        .catch((error) => {
            console.log(error);
        });
    };

    componentDidMount() {
        this.getNewReleases(this.props.token)
    }

    render() {
        let newReleases = null;
        newReleases = this.state.newReleases ? <Card results= {this.state.newReleases.albums.items} /> : null;
        
        return (
            <div className={styles.Home}>
                <h1>New Releases</h1>
                <div className={styles.Cards}>
                    {newReleases}    
                </div>
            </div>
        );
    }
}

export default Home;