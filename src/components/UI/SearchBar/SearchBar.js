import React from 'react';
import styles from './SearchBar.css';

const SearchBar = (props) => {
    return (
        <input className={styles.SearchBar} onKeyUp={props.inputHandler} placeholder="Search for an Album, Artist..." type="text" autoFocus></input>
    )
}
 
export default SearchBar;