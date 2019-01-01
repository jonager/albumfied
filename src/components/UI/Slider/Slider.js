import React from 'react';
import styles from './Slider.css';

const SearchBar = props => {
    let volume = props.volume;
    let volumeClass = null;

    if (props.volume >= 50) {
        volumeClass = 'fas fa-volume-up';
    } else if (volume > 0) {
        volumeClass = 'fas fa-volume-down';
    } else if (volume === 0) {
        volumeClass = 'fas fa-volume-off';
    }

    return (
        <div className={styles.SliderContainer}>
            <i
                onClick={() => props.muteVolume(volume)}
                className={volumeClass}
            />
            <input
                ref={props.inputVolumeRef}
                onMouseUp={props.sliderHandler}
                type="range"
                min="0"
                max="100"
                defaultValue={props.volume}
                onChange={props.setInputValue}
                className={styles.Slider}
            />
        </div>
    );
};

export default SearchBar;
