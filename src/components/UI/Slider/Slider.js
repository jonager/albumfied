import React from 'react';
import styles from './Slider.css';

const SearchBar = (props) => {
    let volume = props.volume
    let volumeClass = null;

    if (props.volume >= 50) {
        volumeClass = "fas fa-volume-up";
    } else if (volume > 0) {
        volumeClass = "fas fa-volume-down";
    } else if (volume === 0) {
        volumeClass = "fas fa-volume-off";
    }

    return (
        <div className={styles.SliderContainer}>
            <i className={volumeClass}></i>
            <input onMouseUp={props.sliderHandler} type="range" min="0" max="100" defaultValue="100" className={styles.Slider}></input>
        </div>
    )
}
 
export default SearchBar;