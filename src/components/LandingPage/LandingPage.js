import React from 'react';
import Button from '../UI/Button/Button';
import * as utility from '../../shared/utility';
import Header from '../Layout/Header/Header';
import styles from './LandingPage.css';

const LandingPage = (props) => {
    return (
        <div>
            <Header isAuth={props.isAuth}/>
            <div className={styles.Hero}>
                <div className={styles.HeroContent}>
                    <h1>Welcome to AlbumFied!</h1>
                    <p>An app that lets your organize your Spotify albums by genres/categories.</p>
                    <a href="https://www.spotify.com/signup/" target="_blank" rel="noopener noreferrer">Sign Up</a>
                    <Button
                        btnType={'Login-Hero'}
                        clicked={utility.spotifyAuth}
                    >Log In</Button>
                </div>
            </div>
        </div>
    );
}
 
export default LandingPage;