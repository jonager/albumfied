import React from 'react';
import { NavLink } from 'react-router-dom'; 
import styles from './Sidebar.css';

const Sidebar = () => {
    return (
        <section className={styles.Sidebar}>
            <ul className={styles.UList}>
                <li>
                    <i class="fas fa-search"></i><NavLink to="/search">Search</NavLink>
                </li>
                <li>
                    <i class="fas fa-home"></i><NavLink to="/user">Home</NavLink>
                </li>
                <li>
                    <i class="fas fa-bars"></i><NavLink to="/library">Your Music</NavLink>
                </li>
            </ul>
        </section>
    );
}
 
export default Sidebar;