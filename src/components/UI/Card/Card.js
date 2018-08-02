import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from './Card.css';
import Button from '../Button/Button';
import * as utility from '../../../shared/utility';

const Card = (props) => {
    let card = props.results.map(item => {
        item = props.totalAlbums ? item.album : item;
        return (
            <div key={item.id} className={styles.Card}>
                {item.images.length !== 0 
                    ? <img style={{width:'225px', height: '225px',...item.type === 'artist' ? {borderRadius: '50%'} : null}} 
                        src={item.images[0].url} 
                        alt="Album/Artist"/> 
                    : <img style={{...item.type === 'artist' ? {borderRadius: '50%'} : null}} 
                        src="https://imgplaceholder.com/225x225/75a016/d8db26?text=picture+unavailable&font-size=20" 
                        alt="Placeholder, not artist picture available"/>}
                <div className={styles.Info}>
                    {item.type === 'artist' 
                        ? <Link to={'/artist/' + item.id} title={item.name}>{item.name}</Link> 
                        : <Link to={'/album/' + item.id} title={item.name}>{item.name}</Link>}
                    {item.type === 'album' 
                        ? <Link to={'/artist/' + item.artists[0].id} title={item.artists[0].name}>{item.artists[0].name}</Link> 
                        : null}
                    {props.save 
                        ? <Button btnType={'Save'} clicked={() => utility.saveAlbumSpotify(localStorage.getItem('token'), item.id)}>Save</Button>
                        : null}
                    {props.delete 
                        ? <Button btnType={'Delete'} clicked={() => props.clicked(props.token, item.id)}>Delete</Button>
                        : null}
                    {props.playlist 
                        ? <Button btnType={'Save'} clicked={props.togleModal} clicked2={() => props.clicked2(item.name, item.artists[0].name, item.id, item.artists[0].id, item.images[0].url)}>save</Button>
                        : null}
                </div>
            </div>
        );
    });
    
    return (
        <React.Fragment>
            {card}
        </React.Fragment>
    );
}
 
export default Card; 