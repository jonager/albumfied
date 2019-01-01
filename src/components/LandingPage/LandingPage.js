import React from 'react';
import styles from './LandingPage.css';

const LandingPage = props => {
    return (
        <div>
            <div className={styles.Hero}>
                <div className={styles.HeroContent}>
                    <h1>Welcome to AlbumFied!</h1>
                    <p>
                        An app that lets your organize your Spotify albums into
                        playlists.
                    </p>
                    <a href="http://localhost:5000/api/auth/spotify">
                        Get Started!
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
