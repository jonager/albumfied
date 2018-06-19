import React from 'react';
import Search from '../../../containers/Search/Search';
import styles from './Content.css';

const Content = (props) => {
    return (
        <div className={styles.Content}>
            {props.isSearch ? <Search/> : null}
        </div>
    );
}
 
export default Content;