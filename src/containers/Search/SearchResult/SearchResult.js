import React from 'react';
import styles from './SearchResult.css';
import { NavLink, Route } from 'react-router-dom'; 
import Card from '../../../components/UI/Card/Card';

const SearchResult = (props) => {
    return (
        <div className={styles.SearchResult}>
            <div  className={styles.SearchResultLinks}>
                <NavLink activeStyle={{color:'#1db954', borderBottom: '#7DCE82 4px inset'}} to="/search/artists">Artists</NavLink>
                <NavLink activeStyle={{color:'#1db954', borderBottom: '#7DCE82 4px inset'}}  to="/search/albums">Albums</NavLink>
            </div>
            <div className={styles.Cards}>
                <Route path="/search/artists" render={() =>  <Card results={props.artists} />} />
                <Route path="/search/albums" render={() => <Card results={props.albums} save={true} notify={props.notify} clicked3={props.resetLibrary} />} />
            </div>
        </div>
    );
}
 
export default SearchResult;