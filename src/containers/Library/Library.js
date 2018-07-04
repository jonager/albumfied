import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom'; 
import Card from '../../components/UI/Card/Card';
import styles from './Library.css';
import axios from 'axios';
class Library extends Component {
    state = {
        totalAlbums: null
    }

    getAlbums = (token) => {
        axios({
            method: 'get',
            url: `https://api.spotify.com/v1/me/albums`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            params: {
                market: 'US',
                limit:  50,
                offset: 0
            }
        })
        .then((response) => {
            this.setState({
                totalAlbums: response.data
            })
        })
        .catch((error) => {
            console.log(error);
        });
    };

    componentDidMount() {
        let token = this.props.token;
        this.getAlbums(token);
    }

    render() {
        let totalAlbums = null;
        totalAlbums = this.state.totalAlbums ? this.state.totalAlbums.items: null;

        return (
            <div className={styles.Library}>
                <div  className={styles.LibraryLinks}>
                    <NavLink activeStyle={{color:'#1db954', borderBottom: '#7DCE82 4px inset'}} to="/library">My Albums</NavLink>
                    <NavLink activeStyle={{color:'#1db954', borderBottom: '#7DCE82 4px inset'}}  to="/library/playlists">Playlists</NavLink>
                </div>
                <div className={styles.Cards}>
                    {this.state.totalAlbums 
                        ? <Route path="/library" render={() =>  <Card totalAlbums={true} results={totalAlbums} />}/> 
                        : null}
                    <Route path="/library/playlists" render={() => <Card />} />d
                </div>
            </div>
        );
    }
}


export default Library;