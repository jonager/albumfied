import React from 'react';
import styles from './Results.css';
import { Link } from 'react-router-dom'; 


const Results = (props) => {
    // TODO: debug why component renders twice
    let card = props.results.items.map(item => {
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
                        <h3>{item.name}</h3> 
                        {item.artists ? <Link to="/" title={item.artists[0].name}>{item.artists[0].name}</Link> : null}
                    </div>
                </div>
            );
        });

    return (
        <React.Fragment>
            {card}
        </React.Fragment>
    )
}
 
export default Results;