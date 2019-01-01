import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.css';

const Sidebar = () => {
    return (
        <section className={styles.Sidebar}>
            <div className={styles.Fixed}>
                <ul className={styles.UList}>
                    <li>
                        <i className="fas fa-search" />
                        <NavLink
                            activeStyle={{ color: '#1db954' }}
                            to="/search">
                            Search
                        </NavLink>
                    </li>
                    <li>
                        <i className="fas fa-home" />
                        <NavLink activeStyle={{ color: '#1db954' }} to="/home">
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <i className="fas fa-bars" />
                        <NavLink
                            activeStyle={{ color: '#1db954' }}
                            to="/library">
                            Your Music
                        </NavLink>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default Sidebar;
