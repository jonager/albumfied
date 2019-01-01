import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.css';

const Header = () => {
    let token = localStorage.getItem('spotifyToken');

    return (
        <header className={styles.Header}>
            <div className={styles.LeftHeader}>
                <i className="fas fa-compact-disc" />
                <Link to="/home">AlbumFied</Link>
            </div>
            <div className={styles.RightHeader}>
                <a
                    className={styles.Github}
                    href="https://github.com/jonager/albumfied"
                    target="_blank"
                    rel="noopener noreferrer">
                    <i className="fab fa-github" />
                </a>
                {!token ? (
                    <a
                        className={styles.Login}
                        href="http://localhost:5000/api/auth/spotify">
                        Log in
                    </a> //convert to a link
                ) : (
                    <NavLink className={styles.LeftHeader} to="/logout">
                        Logout
                    </NavLink>
                )}
            </div>
        </header>
    );
};

export default Header;
