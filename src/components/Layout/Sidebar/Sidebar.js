import React from 'react';
import { NavLink } from 'react-router-dom'; 
import styles from './Sidebar.css';

const Sidebar = () => {
    return (
        <section className={styles.Sidebar}>
            <ul className={styles.UList}>
                <li>
                    <i className="fas fa-search"></i><NavLink activeStyle={{color:'#1db954'}} to="/search">Search</NavLink>
                </li>
                <li>
                    <i className="fas fa-home"></i><NavLink activeStyle={{color:'#1db954'}} to="/home">Home</NavLink>
                </li>
                <li>
                    <i className="fas fa-bars"></i><NavLink activeStyle={{color:'#1db954'}} to="/library">Your Music</NavLink>
                </li>
            </ul>
        </section>
    );
}
 
export default Sidebar;