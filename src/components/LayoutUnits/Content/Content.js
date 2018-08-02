import React from 'react';
import styles from './Content.css';

import SideBar from '../Sidebar/Sidebar';
import Search from '../../../containers/Search/Search';
import Home from '../../../containers/Home/Home';
import Library from '../../../containers/Library/Library';
import Artist from '../../../containers/Artist/Artist'
import Playlist from '../../../containers/Library/Playlists/Playlist/Playlist';

const Content = (props) => {
    return (
        <div className={styles.Content}>
            <SideBar/> 
            {props.isSearch ? <Search/> : null}
            {props.isHome ? <Home token={props.token}/> : null}
            {props.isLibrary ? <Library /> : null}
            {props.isArtist ? <Artist token={props.token}/> : null}
            {props.isPlaylist ? <Playlist token={props.token}/> : null}
        </div>
    );
}
 
export default Content;