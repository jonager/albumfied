import React from 'react';
import SearchBar from '../../UI/SearchBar/SearchBar';
import styles from './Content.css';

const Content = (props) => {
    return (
        <div className={styles.Content}>
            {props.isSearch ? <SearchBar/> : null}
        </div>
    );
}
 
export default Content;