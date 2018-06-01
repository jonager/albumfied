import React from 'react';
import { NavLink, Link } from 'react-router-dom'; 
import styles from './Header.css';
import Button from '../../UI/Button/Button';
import  * as utility from '../../../shared/utility';

const Header = (props) => {
    return (
        <div className={styles.Header}>
            <div className={styles.LeftHeader}>
                <i class="fas fa-compact-disc"></i>
                <a href="#default">AlbumFied</a>
            </div>
            <div className={styles.RightHeader}>
                <Link to="https://github.com/jonager/albumfied">Repo</Link>
                {!props.isAuth 
                    ? <Button btnType={'Login'} clicked={utility.spotifyAuth}> Log In</Button>
                    : <Button btnType={'Login'} clicked={utility.spotifyAuth}> Log Out</Button>}
            </div>
        </div>
    );
}
 
export default Header;