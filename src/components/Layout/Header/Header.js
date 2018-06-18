import React from 'react';
import { NavLink } from 'react-router-dom'; 
import styles from './Header.css';
import Button from '../../UI/Button/Button';
import  * as utility from '../../../shared/utility';

const Header = (props) => {
    let token = localStorage.getItem('token');
    // let timeout = null;

    // const inputChangeHandler = event => {
    //     event.persist();
    //     clearTimeout(timeout);

    //     timeout = setTimeout(function() {
    //         utility.searchItem(token, event.target.value);
    //     }, 2500);
    // }
    
    return (
        <div className={styles.Header}>
            <div className={styles.LeftHeader}>
                <i className="fas fa-compact-disc"></i>
                <a href="#default">AlbumFied</a>
            </div>
            <div className={styles.RightHeader}>
                <a href="https://github.com/jonager/albumfied" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                {!token
                    ? <Button btnType={'Login-Header'} clicked={utility.spotifyAuth}> Log In</Button>
                    : <NavLink className={styles.LeftHeader} to="/logout">Logout</NavLink>}
            </div>
        </div>
    );
}
 
export default Header;