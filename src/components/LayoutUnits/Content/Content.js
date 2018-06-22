import React from 'react';
import styles from './Content.css';

import SideBar from '../Sidebar/Sidebar';
import Search from '../../../containers/Search/Search';
import Home from '../../../containers/Home/Home';
import Library from '../../../containers/Library/Library';

const Content = (props) => {
    return (
        <div className={styles.Content}>
            <SideBar/> 
            {props.isSearch ? <Search/> : null}
            {props.isHome ? <Home/> : null}
            {props.isLibray ? <Library/> : null}
        </div>
    );
}
 
export default Content;