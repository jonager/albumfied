import React, { Component } from 'react';
import Button from '../../components/UI/Button/Button';
import styles from './NowPlayingBar.css';

class NowPlayingBar extends Component {
    state = {}
    render() {
        return (
            <div className={styles.NowPlayingBar}>
                <div className={styles.PlayingButtons}>
                <Button
                    btnType={'Login-Hero'}
                    clicked={this.togleModalAdd}
                    ><i class="fas fa-backward"></i></Button>
                <Button
                    btnType={'Login-Hero'}
                    clicked={this.togleModalAdd}
                    ><i class="far fa-play-circle"></i></Button>
                <Button
                    btnType={'Login-Hero'}
                    clicked={this.togleModalAdd}
                    ><i class="fas fa-forward"></i></Button>
                </div>
            </div>
        );
    }
}

export default NowPlayingBar;