import React from 'react';
import styles from './SearchBar.css';

const SearchBar = () => {
    return (
        <input className={styles.SearchBar} placeholder="Search for an Album, Artist..." type="text" autoFocus></input>
    )
}
 
export default SearchBar;