import React from 'react';
import styles from './SearchResult.css';
import { NavLink } from 'react-router-dom'; 
import { Route } from 'react-router-dom';
import Results from './Results/Results';


const SearchResult = (props) => {
    return (
        <div className={styles.SearchResult}>
            <div className={styles.SearchResultLinks}>
                <NavLink activeStyle={{color:'#1db954'}} to="/search/artists">Artists</NavLink>
                <NavLink activeStyle={{color:'#1db954'}} to="/search/albums">Albums</NavLink>
            </div>

            <Route path="/search/artists" render={() => <Results results={props.results.artists} />} />
            <Route path="/search/albums" render={() => <Results results={props.results.albums} />} />
        </div>
    );
}
 
export default SearchResult;