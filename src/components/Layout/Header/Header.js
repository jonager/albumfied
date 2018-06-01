import React from 'react';
import {  Link } from 'react-router-dom'; 
import styles from './Header.css';
import Button from '../../UI/Button/Button';
import  * as utility from '../../../shared/utility';

const Header = (props) => {
    return (
        <div className={styles.Header}>
            <div className={styles.LeftHeader}>
                <i className="fas fa-compact-disc"></i>
                <a href="#default">AlbumFied</a>
            </div>
            <div className={styles.RightHeader}>
                <Link to="https://github.com/jonager/albumfied">Repo</Link>
                {!props.isAuth 
                    ? <Button btnType={'Login'} clicked={utility.spotifyAuth}> Log In</Button>
                    : <Link to="/logout">Logout</Link>}
            </div>
        </div>
    );
}
 
export default Header;