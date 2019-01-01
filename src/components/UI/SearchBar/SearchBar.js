import React from 'react';
import styles from './SearchBar.css';

const SearchBar = props => {
    return (
        <input
            className={styles.SearchBar}
            onKeyUp={props.inputHandler}
            placeholder="Search for an Album or Artist..."
            type="text"
            autoFocus
        />
    );
};

export default SearchBar;
