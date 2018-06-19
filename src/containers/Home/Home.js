import React, { Component } from 'react';
import Header from '../../components/Layout/Header/Header';
import MainContent from './MainContent/MainContent';
import styles from './Home.css';

class Home extends Component {
    render() {
        return (
            <div className={styles.Layout}>
                <Header/>
                <MainContent isSearch={this.props.isSearch}/>
            </div>
        );
    }
}

export default Home;