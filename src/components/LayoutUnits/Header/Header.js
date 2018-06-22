import React from 'react';
import { Link, NavLink } from 'react-router-dom'; 
import styles from './Header.css';
import Button from '../../UI/Button/Button';
import  * as utility from '../../../shared/utility';

const Header = () => {
    let token = localStorage.getItem('token');
    
    return (
        <header className={styles.Header}>
            <div className={styles.LeftHeader}>
                <i className="fas fa-compact-disc"></i>
                <Link to="/home">AlbumFied</Link>
            </div>
            <div className={styles.RightHeader}>
                <a href="https://github.com/jonager/albumfied" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                {!token
                    ? <Button btnType={'Login-Header'} clicked={utility.spotifyAuth}> Log In</Button>
                    : <NavLink className={styles.LeftHeader} to="/logout">Logout</NavLink>}
            </div>
        </header>
    );
}
 
export default Header;